const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const SchoolApplication = require("../models/SchoolApplication");
const AuditLog = require("../models/AuditLog");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();
const schoolRegistrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after 15 minutes.",
  },
});

// PUBLIC: Submit a new school registration application
router.post("/", schoolRegistrationLimiter, async (req, res) => {
  try {
    const {
      schoolName,
      registrationNumber,
      affiliationNumber,
      board,
      schoolType,
      headName,
      headPhone,
      alternativePhone,
      contactPerson,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const requiredFields = {
      schoolName,
      registrationNumber,
      board,
      schoolType,
      headName,
      headPhone,
      contactPerson,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) =>
        typeof value !== "string" || !value.trim()
      )
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
        missingFields,
      });
    }

    

    const cleanEmail = email.trim().toLowerCase();
const cleanRegistrationNumber = registrationNumber.trim().toUpperCase();

// Check duplicate email
const existingApplication = await SchoolApplication.findOne({
  email: cleanEmail,
});

if (existingApplication) {
  return res.status(409).json({
    success: false,
    message: "An application with this email already exists.",
  });
}

// Check duplicate school registration number
const existingRegistration = await SchoolApplication.findOne({
  registrationNumber: cleanRegistrationNumber,
});

if (existingRegistration) {
  return res.status(409).json({
    success: false,
    message: "An application with this school registration number already exists.",
  });
}

    const application = await SchoolApplication.create({
      schoolName,
      registrationNumber: cleanRegistrationNumber,
      affiliationNumber,
      board,
      schoolType,
      headName,
      headPhone,
      alternativePhone,
      contactPerson,
      email: cleanEmail,
      phone,
      address,
      city,
      state,
      pincode,
    });

    return res.status(201).json({
      success: true,
      message: "School application submitted successfully",
      application: {
        id: application._id,
        schoolName: application.schoolName,
        registrationNumber: application.registrationNumber,
        email: application.email,
        status: application.status,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application details",
        errors: Object.values(error.errors).map(
          (item) => item.message
        ),
      });
    }

    console.error("School application error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit school application",
    });
  }
});

// PRIVATE: Get all applications (Super Admin only)
router.get(
  "/",
  protect,
  authorizeRoles("superadmin"),
  async (req, res) => {
    try {
      const applications = await SchoolApplication.find()
        .sort({ createdAt: -1 })
        .select("-__v");

      return res.status(200).json({
        success: true,
        count: applications.length,
        applications,
      });
    } catch (error) {
      console.error("Fetch applications error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch school applications",
      });
    }
  }
);

// PRIVATE: Update application status (Super Admin only)

// PRIVATE: Update application status and create audit log
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("superadmin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID",
        });
      }

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be approved or rejected",
        });
      }

      // Find existing application
      const application = await SchoolApplication.findById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "School application not found",
        });
      }

      // Store previous status
      const previousStatus = application.status;

      // Update application
      application.status = status;
      await application.save();

      // Create audit log
      await AuditLog.create({
        actorUserId: req.user._id,
        action:
          status === "approved"
            ? "SCHOOL_APPLICATION_APPROVED"
            : "SCHOOL_APPLICATION_REJECTED",
        resourceType: "SchoolApplication",
        resourceId: application._id,
        previousStatus,
        newStatus: status,
        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        message: `Application ${status} successfully`,
        application: {
          id: application._id,
          schoolName: application.schoolName,
          status: application.status,
        },
      });
    } catch (error) {
      console.error("Update application status error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to update application status",
      });
    }
  }
);
// GET Audit Logs - Super Admin Only
router.get(
  "/audit-logs",
  protect,
  authorizeRoles("superadmin"),
  async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .populate("actorUserId", "name email")
        .populate("resourceId", "schoolName")
        .sort({ createdAt: -1 })
        .limit(100);

      return res.status(200).json({
        success: true,
        count: logs.length,
        logs,
      });
    } catch (error) {
      console.error("Audit Log Fetch Error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch audit logs",
      });
    }
  }
);
module.exports = router;