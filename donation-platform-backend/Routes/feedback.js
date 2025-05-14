// const express = require("express");
// const router = express.Router();

// // Import the feedback controller
// const feedbackController = require("../Controllers/feedbackController");

// // Optional auth middleware (if routes are protected)
// // const { protect } = require("../middleware/auth");

// // @route   POST /api/feedback
// // @desc    Submit feedback (protected route)
// // @access  Private (if protect is applied)
// router.post("/submit", feedbackController.submitFeedback);

// // @route   GET /api/feedback/:ngoId
// // @desc    Get all ratings/feedback for a specific NGO
// // @access  Public or Private based on your choice
// router.get("/ngo/:ngoID", feedbackController.getNgoRatings);

// module.exports = router;



const express = require("express");
const router = express.Router();

// Controller
const feedbackController = require("../Controllers/feedbackController");

// Routes

// Submit feedback
router.post("/submit", feedbackController.submitFeedback);

// Get feedback for specific NGO
router.get("/ngo/:ngoId", feedbackController.getNgoRatings);
// @route   GET /api/feedback
// @desc    Get all feedback for all NGOs
// @access  Public
// router.get("/", feedbackController.getAllFeedback);
router.get("/", feedbackController.getAllFeedback);
module.exports = router;
