import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import dbConnect from "../../../utils/dbConnect";
// import User from "../../../models/User";

import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

dbConnect();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, role } = req.body;

    try {
      if (role !== "admin") {
        return res.status(400).json({ message: "Invalid role" });
      }

      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const admin = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await admin.save();

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
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
