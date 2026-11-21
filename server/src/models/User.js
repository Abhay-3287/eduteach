
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
    },

    // Store only a securely hashed password, never plain text.
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },

    role: {
      type: String,
      required: true,
      enum: ["superadmin", "schooladmin", "teacher", "parent"],
    },

    // Super Admin has no schoolId.
    // Other school users belong to a specific school.
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
      validate: {
        validator: function (value) {
          if (this.role === "superadmin") {
            return value === null || value === undefined;
          }

          return value !== null && value !== undefined;
        },
        message: "A school ID is required for this role.",
      },
    },

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
