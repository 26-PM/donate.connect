const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      // validate: {
      //   validator: function (value) {
      //     return validator.isMobilePhone(value, "en-IN") && value.length === 10;
      //   },
      //   message: "Enter a valid 10-digit Indian mobile number",
      // },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
