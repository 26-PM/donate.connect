import mongoose from 'mongoose';
import validator from 'validator';

// Interface for NGO address
interface INgoAddress {
  streetNumber: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

// Interface for NGO document
export interface INgo extends mongoose.Document {
  name: string;
  registrationNumber: string;
  email: string;
  password: string;
  mobile: string;
  address: INgoAddress;
  itemsAccepted: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ngoSchema = new mongoose.Schema(
  {
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
        validator: (value: string) => validator.isEmail(value),
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
      streetNumber: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
        validate: {
          validator: (value: string) => validator.isPostalCode(value, "IN"),
          message: "Please enter a valid Indian pincode",
        },
      },
    },
    itemsAccepted: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
ngoSchema.index({ email: 1 });
ngoSchema.index({ registrationNumber: 1 });

export const Ngo = mongoose.models.Ngo || mongoose.model<INgo>("Ngo", ngoSchema); 