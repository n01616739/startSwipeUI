// pages/api/auth/admin/upload-image.js

import formidable from "formidable";
import fs from "fs";
import path from "path";
import dbConnect from "@/utils/dbConnect";
import Question from "@/models/Question";
import { getIO } from "@/lib/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const form = new formidable.IncomingForm();
    const uploadDir = path.join(process.cwd(), "public", "images");
    fs.mkdirSync(uploadDir, { recursive: true });
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.multiples = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("❌ Form parse error:", err);
        return res.status(400).json({ message: "Error in file upload" });
      }

      const image_left = files.file_left?.[0]?.newFilename || files.file_left?.newFilename;
      const image_right = files.file_right?.[0]?.newFilename || files.file_right?.newFilename;

      if (!image_left || !image_right) {
        return res.status(400).json({ message: "Both image files must be uploaded." });
      }

      await dbConnect();

      const newQuestion = new Question({ image_left, image_right });
      await newQuestion.save();

      const io = getIO();
      if (io) {
        console.log("📢 Emitting newImage via Socket.IO");
        io.emit("newImage", {
          _id: newQuestion._id,
          image_left,
          image_right,
        });
      }

      return res.status(200).json({ message: "Images added successfully", question: newQuestion });
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
