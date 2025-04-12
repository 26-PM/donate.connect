const Donation = require("../Models/Donation");
const User = require("../Models/Users");
const NGO = require("../Models/Ngo");
const sendEmail = require("../utils/email");
const sendSMS = require("../utils/sms");
const { getExpectedBodyHash } = require("twilio/lib/webhooks/webhooks");
const mongoose = require('mongoose');

const createDonation = async (req, res) => {
  try {
    const { ngo, items, pickupAddress, pickupOption, pickupDate, pickupTime, notes, userId } = req.body;

    // Validate required fields
    console.log({ ngo, items, pickupAddress, pickupOption, pickupDate, pickupTime, notes, userId });
    if (!userId || !ngo || !items || !pickupAddress) {
      return res.status(400).json({ 
        msg: "Missing required fields",
        required: ["userId", "ngo", "items", "pickupAddress"]
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "At least one item is required" });
    }

    // Validate each item
    for (const item of items) {
      if (!item.itemName || !item.quantity) {
        return res.status(400).json({ 
          msg: "Each item must have itemName and quantity",
          item
        });
      }
      if (item.quantity < 1) {
        return res.status(400).json({ 
          msg: "Quantity must be at least 1",
          item
        });
      }
    }

    // Validate pickup option
    if (!["scheduled", "asap"].includes(pickupOption)) {
      return res.status(400).json({ 
        msg: "Invalid pickup option. Must be 'scheduled' or 'asap'",
        pickupOption
      });
    }

    // Validate pickup date and time for scheduled pickups
    if (pickupOption === "scheduled") {
      if (!pickupDate || !pickupTime) {
        return res.status(400).json({ 
          msg: "Pickup date and time are required for scheduled pickups"
        });
      }
      if (!["morning", "afternoon", "evening"].includes(pickupTime)) {
        return res.status(400).json({ 
          msg: "Invalid pickup time. Must be 'morning', 'afternoon', or 'evening'",
          pickupTime
        });
      }
    }

    const donor = await User.findById(userId);
    if (!donor) {
      return res.status(404).json({ msg: "Donor not found" });
    }

    const ngoData = await NGO.findById(ngo);
    if (!ngoData) {
      return res.status(404).json({ msg: "NGO not found" });
    }
    
    const donation = await Donation.create({
      user: userId,
      ngo,
      items: items.map(item => ({
        itemName: item.itemName,
        quantity: item.quantity,
        description: item.description || "",
        images: item.images.map(img => ({
          url: img.url,
          analysis: img.analysis || ""
        }))
      })),
      pickupAddress,
      pickupOption,
      pickupDate: pickupOption === "scheduled" ? pickupDate : null,
      pickupTime: pickupOption === "scheduled" ? pickupTime : null,
      notes: notes || "",
      status: "Pending"
    });

    // Send email to donor
    await sendEmail({
      to: donor.email,
      subject: "Donation Confirmation",
      html: `
        <p>Hi ${donor.name},</p>
        <p>Your donation request to ${ngoData.name} has been received. Here are the details:</p>
        <ul>
          ${items.map(item => `<li>${item.quantity} ${item.itemName}</li>`).join('')}
        </ul>
        <p>Pickup Details:</p>
        <ul>
          <li>Option: ${pickupOption === "scheduled" ? "Scheduled" : "As soon as possible"}</li>
          ${pickupOption === "scheduled" ? `
            <li>Date: ${new Date(pickupDate).toLocaleDateString()}</li>
            <li>Time: ${pickupTime}</li>
          ` : ''}
          <li>Address: ${pickupAddress}</li>
        </ul>
        <p>The NGO will contact you soon to arrange the pickup.</p>
        <p>Thank you for your generosity!</p>
      `
    });

    // Send email to NGO
    await sendEmail({
      to: ngoData.email,
      subject: "New Donation Request",
      html: `
        <p>Hi ${ngoData.name},</p>
        <p>You have received a new donation request from ${donor.name} (${donor.email}).</p>
        <p>Donation Details:</p>
        <ul>
          ${items.map(item => `<li>${item.quantity} ${item.itemName}</li>`).join('')}
        </ul>
        <p>Pickup Details:</p>
        <ul>
          <li>Option: ${pickupOption === "scheduled" ? "Scheduled" : "As soon as possible"}</li>
          ${pickupOption === "scheduled" ? `
            <li>Date: ${new Date(pickupDate).toLocaleDateString()}</li>
            <li>Time: ${pickupTime}</li>
          ` : ''}
          <li>Address: ${pickupAddress}</li>
        </ul>
        <p>Please contact the donor to arrange pickup.</p>
      `
    });

    // Send SMS to donor
    await sendSMS({
      to: donor.mobile,
      body: `Hi ${donor.name}, your donation request to ${ngoData.name} has been received. The NGO will contact you soon for pickup.`
    });

    // Send SMS to NGO
    await sendSMS({
      to: ngoData.mobile,
      body: `New donation request from ${donor.name}. Please check your email for details.`
    });

    res.status(201).json({ 
      success: true,
      message: "Donation request submitted successfully",
      data: donation 
    });
  } catch (err) {
    console.error('Donation creation error:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to create donation request",
      error: err.message 
    });
  }
};

const getUserDonations = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching donations for user:', userId);
    
    const donations = await Donation.find({ user: userId })
      .populate('ngo', 'name')
      .sort({ createdAt: -1 });

    console.log('Donations found:', donations);
    res.status(200).json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
      error: error.message
    });
  }
};

const getDonationById = async (req, res) => {
  try {
    const { id, userId } = req.params;
    console.log('Getting donation:', { id, userId });

    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid donation ID format'
      });
    }
    
    const donation = await Donation.findById(id)
      .populate('ngo', 'name')
      .populate('user', 'name email');

    console.log('Found donation:', donation);

    if (!donation) {
      console.log('No donation found with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check if the requesting user is the owner of the donation
    if (donation.user._id.toString() !== userId) {
      console.log('User not authorized:', {
        donationUserId: donation.user._id.toString(),
        requestingUserId: userId
      });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this donation'
      });
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Error in getDonationById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation',
      error: error.message
    });
  }
};

module.exports = {
  createDonation,
  getUserDonations,
  getDonationById
};
