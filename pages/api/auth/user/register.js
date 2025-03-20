// pages/api/auth/user/register.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";  // Absolute import using @ prefix


//import dbConnect from "../../../utils/dbConnect";
//import User from "../../../models/User";

dbConnect();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, role } = req.body;

    try {
      if (role !== "user" && role !== "admin") {
        return res.status(400).json({ message: "Invalid role" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });
      // Log the user data before saving to DB
      console.log("New user object:", user);

      await user.save();

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
