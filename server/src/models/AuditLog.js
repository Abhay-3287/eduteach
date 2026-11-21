
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "SCHOOL_APPLICATION_APPROVED",
        "SCHOOL_APPLICATION_REJECTED",
      ],
    },

    resourceType: {
      type: String,
      required: true,
      enum: ["SchoolApplication"],
      default: "SchoolApplication",
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SchoolApplication",
    },

    previousStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
    },

    newStatus: {
      type: String,
      enum: ["approved", "rejected"],
      required: true,
    },

    ipAddress: {
      type: String,
      trim: true,
      maxlength: 64,
    },
  },
  {
    timestamps: true,
  }
);

// Useful database indexes
auditLogSchema.index({ actorUserId: 1, createdAt: -1 });
auditLogSchema.index({ resourceId: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
