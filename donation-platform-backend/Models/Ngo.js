// const mongoose = require("mongoose");
// const validator = require("validator");

// const ngoSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "NGO name is required"],
//       trim: true,
//     },
//     registrationNumber: {
//       type: String,
//       required: [true, "Registration number is required"],
//       unique: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       validate: {
//         validator: validator.isEmail,
//         message: "Please enter a valid email",
//       },
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters"],
//     },
//     mobile: {
//       type: String,
//       required: [true, "Mobile number is required"],
//       // validate: {
//       //   validator: function (value) {
//       //     return validator.isMobilePhone(value, "en-IN") && value.length === 10;
//       //   },
//       //   message: "Enter a valid 10-digit Indian mobile number",
//       // },
//     },
//     address: {
//       streetNumber: {
//         type: String,
//         required: true,
//       },
//       landmark: {
//         type: String,
//         // required: true,
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       state: {
//         type: String,
//         required: true,
//       },
//       country: {
//         type: String,
//         required: true,
//       },
//       pincode: {
//         type: String,
//         required: true,
//         validate: {
//           validator: function (value) {
//             return validator.isPostalCode(value, "IN");
//           },
//           message: "Please enter a valid Indian pincode",
//         },
//       },
//     },
//     itemsAccepted: {
//       type: [String],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Ngo", ngoSchema);






const mongoose = require("mongoose");
const validator = require("validator");

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "NGO name is required"],
    trim: true,
  },
  registrationNumber: {
    type: String,
    required: [true, "Registration number is required"],
    unique: true,
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
  },
  address: {
    streetNumber: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isPostalCode(value, "IN");
        },
        message: "Please enter a valid Indian pincode",
      },
    },
  },
  itemsAccepted: {
    type: [String],
    default: [],
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Add text index for search
ngoSchema.index({ name: 'text', 'address.city': 'text', 'address.state': 'text' });

module.exports = mongoose.model("Ngo", ngoSchema);