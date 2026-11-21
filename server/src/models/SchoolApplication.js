
const mongoose = require("mongoose");

const schoolApplicationSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },

    affiliationNumber: {
      type: String,
      trim: true,
      default: "",
    },

    board: {
      type: String,
      required: true,
      enum: ["CBSE", "CISCE", "State Board", "IB", "Cambridge", "Other"],
    },

    schoolType: {
      type: String,
      required: true,
      enum: ["Government", "Private", "Government Aided", "International", "Other"],
    },

    headName: {
      type: String,
      required: true,
      trim: true,
    },

    headPhone: {
      type: String,
      required: true,
      match: [/^[6-9][0-9]{9}$/, "Enter a valid head phone number"],
    },

    alternativePhone: {
      type: String,
      default: "",
      match: [/^$|^[6-9][0-9]{9}$/, "Enter a valid alternative phone number"],
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"],
    },

    phone: {
      type: String,
      required: true,
      match: [/^[6-9][0-9]{9}$/, "Enter a valid school contact number"],
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, "Enter a valid 6-digit pincode"],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SchoolApplication",
  schoolApplicationSchema
);
