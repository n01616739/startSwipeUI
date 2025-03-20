"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/router";
import Model from "@/components/dog"; // 3D Dog Model
import Confetti from "react-confetti"; // 🎉 Import Confetti

export default function Home() {
    console.log("Rendering Home.js...");

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);  // Start from the first question after shuffle
    const [hydrated, setHydrated] = useState(false);
    const [allAnswered, setAllAnswered] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false); // 🎉 State to trigger confetti
    const [answeredCount, setAnsweredCount] = useState(0); // ✅ Count of answered questions
    const [unansweredCount, setUnansweredCount] = useState(0); // ✅ Count of unanswered questions
    const [answeredQuestions, setAnsweredQuestions] = useState([]);  // Track answered question IDs

    const router = useRouter();
    const [userEmail, setUserEmail] = useState(null);

    // Ensure hydration is complete before reading from localStorage
    useEffect(() => {
        console.log("🔥 Hydration started...");
        setHydrated(true);

        const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
        console.log("✅ User Email from localStorage:", email);
        setUserEmail(email);

        // Check if all questions have already been answered
        const isAllAnswered = localStorage.getItem(`allAnswered_${email}`);
        if (isAllAnswered === "true") {
            setAllAnswered(true);
        }
    }, []);

    // Fetch unanswered questions when the component is hydrated and userEmail is available
    useEffect(() => {
        if (!hydrated || !userEmail) {
            console.log("🚨 Skipping API call - Hydration not complete or no user email.");
            return;
        }

        async function fetchUnansweredQuestions() {
            try {
                console.log("📢 Fetching unanswered questions for:", userEmail);
                const res = await fetch(`/api/unanswered?email=${userEmail}`);

                if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);

                const data = await res.json();
                console.log("✅ Fetched Questions:", data);

                // Ensure the data is an array and it's not empty
                if (!Array.isArray(data)) {
                    console.error("❌ Data is not an array:", data);
                    return;
                }

                // If there are no questions left, skip shuffling
                if (data.length === 0) {
                    setAllAnswered(true);
                    localStorage.setItem(`allAnswered_${userEmail}`, "true"); // Set the flag in localStorage
                    setShowConfetti(true); // 🎉 Trigger confetti when done
                    return; // No more questions to show
                }

                // Shuffle the questions randomly only if there are unanswered questions
                const shuffledQuestions = shuffleArray(data);

                // Filter out answered questions
                const filteredQuestions = shuffledQuestions.filter(q => !answeredQuestions.includes(q._id));

                // Handle case where no unanswered questions remain
                if (filteredQuestions.length === 0) {
                    console.log("🚀 No more unanswered questions.");
                    setAllAnswered(true);
                    localStorage.setItem(`allAnswered_${userEmail}`, "true"); // Set the flag in localStorage
                    setShowConfetti(true); // 🎉 Trigger confetti when done
                } else {
                    setQuestions(filteredQuestions);
                    setAnsweredCount(0); // Reset answered count
                    setUnansweredCount(filteredQuestions.length); // Store unanswered question count
                    setCurrentIndex(0); // Start from the first unanswered question after shuffle
                    console.log("✅ First question set:", filteredQuestions[0]);
                }
            } catch (error) {
                console.error("❌ Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUnansweredQuestions();
    }, [hydrated, userEmail, answeredQuestions]);

    // Fisher-Yates (Knuth) Shuffle function
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    };

    // Handle user answer for a question
    const handleAnswer = async (questionId, answer) => {
        try {
            console.log(`📝 User answered: ${answer} for question: ${questionId}`);

            await fetch("/api/save-answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, questionId, answer }),
            });

            // Add answered question ID to the list
            setAnsweredQuestions((prevAnsweredQuestions) => [...prevAnsweredQuestions, questionId]);

            // Remove answered question from the list
            setQuestions((prevQuestions) =>
                prevQuestions.filter((q) => q._id !== questionId)
            );

            setAnsweredCount((prevCount) => prevCount + 1); // Increase answered count

            // Move to the next question if there are more
            if (currentIndex + 1 < unansweredCount) {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                setAllAnswered(true);
                localStorage.setItem(`allAnswered_${userEmail}`, "true"); // Set flag in localStorage when all questions are answered
                setShowConfetti(true); // 🎉 Show confetti when last question is answered
            }
        } catch (error) {
            console.error("❌ Error saving answer:", error);
        }
    };

    // Handle skip logic (move to the next question or finish)
    const handleSkip = () => {
        if (currentIndex + 1 < unansweredCount) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
            setAllAnswered(true);
            setShowConfetti(true); // 🎉 Show confetti when skipping last question
        }
    };

    // Exit logic (clear token and navigate away)
    const handleExit = () => {
        localStorage.removeItem("token");
        router.push("/StartSwipeButton");
    };

    const handleLogout = () => {
        // Remove user email and token from localStorage
        localStorage.removeItem("userEmail");
        localStorage.removeItem("token");
    
        // Redirect the user to the login page
        router.push("/login");
    };

    if (allAnswered) {
        return (
            <div style={{ textAlign: "center", padding: "20px", position: "relative" }}>
                {showConfetti && <Confetti numberOfPieces={300} recycle={false} />} {/* 🎉 Confetti Animation */}
                <h2>🎉 All questions are done! Please come back later.</h2>
                <p>You've answered all available questions. Thank you!</p>
                <button
                    onClick={() => router.push("/StartSwipeButton")}
                    style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}
                >
                    Restart
                </button>
                <br />
                <button
                    onClick={handleLogout}  // Handle logout logic
                    style={{ padding: "10px 20px", backgroundColor: "#ff4d4d", color: "white", border: "none", cursor: "pointer", borderRadius: "5px", marginTop: "10px" }}
                >
                    Logout
                </button>
            </div>
        );
    }

    if (!hydrated || loading) return <p>⏳ Loading questions...</p>;

    if (!questions.length || !questions[currentIndex]) return <p>⚠️ No questions available.</p>;

    const currentQuestion = questions[currentIndex];

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", flexDirection: "column" }}>
            <div style={{ position: "absolute", top: "10px", width: "100%", display: "flex", justifyContent: "space-between", padding: "10px 20px", zIndex: 10 }}>
                <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "5px" }} onClick={handleExit}>
                    Exit
                </button>

                <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }} onClick={handleSkip}>
                    Skip
                </button>
            </div>

            {/* Left Image - Clickable */}
            <img src={`/images/${currentQuestion.image_left}`} alt="Left Option"
                style={{
                    position: "absolute", left: "10%", bottom: "30%", cursor: "pointer",
                    width: "350px", height: "350px", transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out", zIndex: 10
                }}
                onClick={() => handleAnswer(currentQuestion._id, "left")}
            />

            {/* 3D Model (Dog in the center) */}
            <Canvas camera={{ position: [0, 2, 5], fov: 50 }}
                style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", zIndex: 1 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[3, 3, 3]} intensity={1} />
                <OrbitControls />
                <Model scale={0.15} />
            </Canvas>

            {/* Right Image - Clickable */}
            <img src={`/images/${currentQuestion.image_right}`} alt="Right Option"
                style={{
                    position: "absolute", right: "10%", bottom: "30%", cursor: "pointer",
                    width: "350px", height: "350px", transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out", zIndex: 10
                }}
                onClick={() => handleAnswer(currentQuestion._id, "right")}
            />

            {/* Progress Bar with Answered / Unanswered Questions */}
            <div style={{ position: "absolute", bottom: "5%", width: "80%", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
                ✅ {answeredCount} / {unansweredCount} Questions Answered
            </div>
        </div>
    );
}
