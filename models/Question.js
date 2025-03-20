import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  image_left: { type: String, required: true },     
  image_right: { type: String, required: true },    
});

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
