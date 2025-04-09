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
      },
    ],
    pickupAddress: {
      street: String,
      landmark: String,
      city: String,
      state: String,
      pincode: {
        type: String,
        validate: {
          validator: function (value) {
            return validator.isPostalCode(value, "IN");
          },
          message: "Invalid pincode",
        },
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
