// // import mongoose from "mongoose";
// const mongoose = require("mongoose");
// const FeedbackSchema = new mongoose.Schema({
//   ease: Number,
//   pickup: String,
//   pickupComment: String,
//   recommend: String,
//   improvement: String,
//   rating: Number,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // export default mongoose.model("Feedback", FeedbackSchema);
// module.exports = mongoose.model("Feedback", FeedbackSchema);




const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ngo",
    required: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  ease: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  pickup: {
    type: String,
    enum: ["Yes", "No", "Could be improved"],
    required: true
  },
  pickupComment: {
    type: String,
    required: function() {
      return this.pickup === "Could be improved";
    }
  },
  recommend: {
    type: String,
    enum: ["Yes", "No", "Not sure"],
    required: true
  },
  improvement: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
}, { timestamps: true });

// Indexes
feedbackSchema.index({ ngo: 1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);


// const mongoose = require("mongoose");

// const feedbackSchema = new mongoose.Schema({
//   ngo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Ngo",
//     required: true
//   },
//   donor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   ease: {
//     type: Number,
//     min: 1,
//     max: 5,
//     required: true
//   },
//   pickup: {
//     type: String,
//     enum: ["Yes", "No", "Could be improved"],
//     required: true
//   },
//   pickupComment: {
//     type: String,
//     required: function() {
//       return this.pickup === "Could be improved";
//     }
//   },
//   recommend: {
//     type: Boolean,  // Changed to Boolean
//     required: true
//   },
//   improvement: {
//     type: String,
//     required: true
//   },
//   rating: {
//     type: Number,
//     min: 1,
//     max: 5,
//     required: true
//   }
// }, { timestamps: true });

// // Indexes
// feedbackSchema.index({ ngo: 1 });
// feedbackSchema.index({ createdAt: -1 });

// module.exports = mongoose.model("Feedback", feedbackSchema);
