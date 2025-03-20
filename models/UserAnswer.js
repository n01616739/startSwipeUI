import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Reference to the user
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }, // Reference to the question
  answer: { type: String, enum: ["left", "right"], required: true }, // User's answer (left or right)
  timestamp: { type: Date, default: Date.now }, // Timestamp when the answer was submitted
});

const UserAnswer = mongoose.models.UserAnswer || mongoose.model("UserAnswer", userAnswerSchema);

export default UserAnswer;
