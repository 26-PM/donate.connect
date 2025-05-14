
// const Feedback = require("../Models/Feedback");
// const Ngo = require("../Models/Ngo");

// exports.submitFeedback = async (req, res) => {
//   try {
//     console.log(req.body)
//     const { ngo, rating, ...feedbackData } = req.body;
//     if (!ngo || !rating) {
//       return res.status(400).json({
//         success: false,
//         message: "NGO ID and Rating are required"
//       });
//     }

//     // Check if NGO exists
//     const ngoData = await Ngo.findById(ngo);
//     console.log(ngoData)
//     if (!ngoData) {
//       return res.status(404).json({
//         success: false,
//         message: "NGO not found"
//       });
//     }

//     // Create feedback
//     const feedback = await Feedback.create({
//       ...feedbackData,
//       rating,
//       ngo ,
//       donor: req.user?._id || null // If you have authentication
//     });

//     // Update NGO rating
//     const newTotal = ngoData.rating.average * ngoData.rating.count + rating;
//     const newCount = ngoData.rating.count + 1;
//     const newAverage = Math.min(5, Math.max(0, newTotal / newCount));

//     ngoData.rating = {
//       average: parseFloat(newAverage.toFixed(1)),
//       count: newCount
//     };

//     await ngoData.save();

//     res.status(201).json({
//       success: true,
//       data: feedback,
//       message: "Feedback submitted successfully"
//     });
//   } catch (error) {
//     console.error("Error submitting feedback:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

// exports.getNgoRatings = async (req, res) => {
//   try {
//     const { ngoId } = req.params;

//     // Check if NGO exists
//     const ngo = await Ngo.findById(ngoId);
//     if (!ngo) {
//       return res.status(404).json({
//         success: false,
//         message: "NGO not found"
//       });
//     }

//     const ratings = await Feedback.find({ ngo: ngoId })
//       .sort({ createdAt: -1 })
//       .populate('donor', 'name email');

//     res.status(200).json({
//       success: true,
//       data: ratings
//     });
//   } catch (error) {
//     console.error("Error fetching ratings:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };



const Feedback = require("../Models/Feedback");
const Ngo = require("../Models/Ngo");

// @desc    Submit feedback for an NGO
// @route   POST /api/feedback/submit
// @access  Public or Private (depending on usage)
exports.submitFeedback = async (req, res) => {
  try {
    console.log("Incoming Feedback:", req.body);

    const { ngo, rating, ease, pickup, pickupComment, recommend, improvement } = req.body;

    if (!ngo || typeof rating === "undefined") {
      return res.status(400).json({
        success: false,
        message: "NGO ID and rating are required",
      });
    }

    // Check if NGO exists
    const ngoData = await Ngo.findById(ngo);
    if (!ngoData) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      ngo,
      donor: req.user?._id || null, // Optional: Based on authentication
      rating,
      ease,
      pickup,
      pickupComment,
      recommend,
      improvement,
    });

    console.log("Feedback saved:", feedback);

    // Calculate new NGO rating
    const currentAvg = ngoData.rating?.average || 0;
    const currentCount = ngoData.rating?.count || 0;

    const newTotal = currentAvg * currentCount + rating;
    const newCount = currentCount + 1;
    const newAverage = Math.min(5, Math.max(0, newTotal / newCount));

    ngoData.rating = {
      average: parseFloat(newAverage.toFixed(1)),
      count: newCount,
    };

    await ngoData.save();
    console.log("NGO rating updated:", ngoData.rating);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get all feedback for an NGO
// @route   GET /api/feedback/ngo/:ngoId
// @access  Public
exports.getNgoRatings = async (req, res) => {
  try {
    const { ngoId } = req.params;

    // Check if NGO exists
    const ngo = await Ngo.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    // Fetch feedback sorted by newest first
    const ratings = await Feedback.find({ ngo: ngoId })
      .sort({ createdAt: -1 })
      .populate("donor", "name email"); // Populates donor name/email if available

    res.status(200).json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error("Error fetching NGO feedback:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    // Fetch all feedback sorted by newest first
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 }) // You can sort it by creation date or any other field
      .populate("ngo", "name") // Populate NGO name
      .populate("donor", "name email"); // Optionally populate donor name and email

    if (feedbacks.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No feedback available.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error fetching all feedback:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};