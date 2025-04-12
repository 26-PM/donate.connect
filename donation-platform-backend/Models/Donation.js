const mongoose = require("mongoose");
const validator = require("validator");

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ngo",
      required: true,
    },
    items: [
      {
        itemName: {
          type: String,
          required: [true, "Item name is required"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        description: {
          type: String,
          default: "",
        },
        images: [{
          url: {
            type: String,
            required: true
          },
          analysis: {
            type: String,
            default: ""
          }
        }]
      },
    ],
    pickupAddress: {
      type: String,
      required: [true, "Pickup address is required"]
    },
    pickupOption: {
      type: String,
      enum: ["scheduled", "asap"],
      default: "asap",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: function() {
        return this.pickupOption === "scheduled";
      },
    },
    pickupTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: function() {
        return this.pickupOption === "scheduled";
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
donationSchema.index({ user: 1, status: 1 });
donationSchema.index({ ngo: 1, status: 1 });
donationSchema.index({ status: 1 });

module.exports = mongoose.model("Donation", donationSchema);
