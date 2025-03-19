import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Admin } from "./shared/models/admin.model";

// Replace with your MongoDB connection string
const MONGODB_URI = "mongodb://localhost:27017/brix";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected.");

    const name = "Admin123";
    const email = "admin123@gmail.com";
    const plainPassword = "Admin123";

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin with this email already exists!");
      return;
    }

    // Create new admin document
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("Admin created successfully!");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
