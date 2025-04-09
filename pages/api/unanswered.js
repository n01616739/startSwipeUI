// // /api/unanswered.js
// import dbConnect from "@/utils/dbConnect";
// import User from "@/models/User";
// import UserAnswer from "@/models/UserAnswer";
// import Question from "@/models/Question";

// export default async function handler(req, res) {
//     res.setHeader('Cache-Control', 'no-store'); // Prevent caching of the API response

//     console.log("API Called: /api/unanswered");

//     if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

//     try {
//         await dbConnect();
//         const { email } = req.query;
//         console.log(`Fetching unanswered questions for: ${email}`);

//         // Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             console.error("User not found:", email);
//             return res.status(404).json({ message: "User not found" });
//         }
//         console.log("User found:", user);

//         // Fetch all questions
//         const allQuestions = await Question.find();
//         console.log("Total Questions in DB:", allQuestions.length);

//         // Get questions the user has answered
//         const answeredQuestions = await UserAnswer.find({ user_id: user._id }).select("question_id");
//         console.log("Answered Questions:", answeredQuestions.length);

//         // Extract IDs of answered questions
//         const answeredIds = answeredQuestions.map(a => a.question_id.toString());

//         // Fetch unanswered questions by excluding answered question IDs
//         const unansweredQuestions = await Question.find({
//             _id: { $nin: answeredIds }
//         });

//         console.log("Unanswered Questions Fetched:", unansweredQuestions.length);

//         // If there are no more unanswered questions, send a message
//         if (unansweredQuestions.length === 0) {
//             return res.status(200).json({ message: "No more questions available. Please come back later!" });
//         }

//         return res.status(200).json(unansweredQuestions);
//     } catch (error) {
//         console.error("API Error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }


// /api/unanswered.js
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import UserAnswer from "@/models/UserAnswer";
import Question from "@/models/Question";

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        await dbConnect();
        const { email } = req.query;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const answeredQuestions = await UserAnswer.find({ user_id: user._id }).select("question_id");
        const answeredIds = answeredQuestions.map(a => a.question_id); // ✅ Already ObjectId

        const unansweredQuestions = await Question.find({
            _id: { $nin: answeredIds },
        });

        if (unansweredQuestions.length === 0) {
            return res.status(200).json({ message: "No more questions available. Please come back later!" });
        }

        return res.status(200).json(unansweredQuestions);
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
