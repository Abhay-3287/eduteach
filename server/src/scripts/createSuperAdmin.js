
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createSuperAdmin = async () => {
  try {
    // Check required environment variables
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } =
      process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGO_URI) {
      throw new Error("Required admin environment variables are missing.");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must be at least 12 characters.");
    }

    await mongoose.connect(MONGO_URI);

    // Allow only the first Super Admin to be created this way
    const existingAdmin = await User.exists({ role: "superadmin" });

    if (existingAdmin) {
      console.log("A Super Admin account already exists.");
      return;
    }

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("This email is already registered.");
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME.trim(),
      email,
      passwordHash,
      role: "superadmin",
      schoolId: null,
      status: "active",
    });

    console.log("Initial Super Admin created successfully.");
  } catch (error) {
    console.error("Super Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createSuperAdmin();
