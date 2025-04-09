const Donation = require("../Models/Donation");
const User = require("../Models/Users");
const NGO = require("../Models/Ngo");
const sendEmail = require("../utils/email");
const sendSMS = require("../utils/sms");
const { getExpectedBodyHash } = require("twilio/lib/webhooks/webhooks");

const createDonation = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { ngo, items, address } = req.body;

    if (!userId) return res.status(401).json({ msg: "Unauthorized" });

    const donor = await User.findById(userId);
    const ngoData = await NGO.findById(ngo);

    const donation = await Donation.create({
      user: userId,
      ngo,
      items,
      address,
    });

    await sendEmail({
      to: donor.email,
      subject: "Donation Confirmation",
      html: `<p>Hi ${donor.email},<br>Your donation to ${ngoData.name} has been received. Thank you!</p>`,
    });

    await sendEmail({
      to: ngoData.email,
      subject: "New Donation Received",
      html: `<p>Hi ${ngoData.name},<br>You have received a new donation request from ${donor.email}.</p>`,
    });

    await sendSMS({
      to: donor.mobile,
      body: `Hi ${donor.email}, your donation request to ${ngoData.name} has been received. Thank you!`,
    });

    // Send SMS to NGO
    await sendSMS({
      to: ngoData.mobile,
      body: `Hi ${ngoData.name}, you have received a new donation request from ${donor.email}.`,
    });

    res.status(201).json({ msg: "Donation recorded", donation });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { createDonation };
