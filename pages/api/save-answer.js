// /api/save-answer.js
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import UserAnswer from "@/models/UserAnswer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        // Only accept POST method
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        await dbConnect();
        const { email, questionId, answer } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the user already answered this question
        const existingAnswer = await UserAnswer.findOne({ user_id: user._id, question_id: questionId });
        if (existingAnswer) {
            return res.status(400).json({ message: "You have already answered this question" });
        }

        // Save the user's answer
        const userAnswer = new UserAnswer({
            user_id: user._id,
            question_id: questionId,
            answer: answer,
        });

        await userAnswer.save();
        return res.status(200).json({ message: "Answer saved successfully" });
    } catch (error) {
        console.error("Error saving answer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
