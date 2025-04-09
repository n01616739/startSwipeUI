// pages/api/questions-count.js
import dbConnect from "@/utils/dbConnect";
import Question from "@/models/Question";

export default async function handler(req, res) {
  try {
    await dbConnect();
    const total = await Question.countDocuments();
    res.status(200).json({ total });
  } catch (err) {
    console.error("Error getting total questions:", err);
    res.status(500).json({ message: "Failed to get total questions" });
  }
}
