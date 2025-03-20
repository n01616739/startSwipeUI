"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/router";
import Model from "@/components/dog"; // ✅ 3D Dog Model
import Confetti from "react-confetti"; // 🎉 Import Confetti

export default function Home() {
    console.log("🌟 Rendering Home.js...");
    
    const [questions, setQuestions] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hydrated, setHydrated] = useState(false);
    const [allAnswered, setAllAnswered] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false); // 🎉 State to trigger confetti
    const [answeredCount, setAnsweredCount] = useState(0); // ✅ Count of answered questions
    const [unansweredCount, setUnansweredCount] = useState(0); // ✅ Count of unanswered questions

    const router = useRouter();
    const [userEmail, setUserEmail] = useState(null);

    // ✅ Ensure hydration is complete before reading from localStorage
    useEffect(() => {
        console.log("🔥 Hydration started...");
        setHydrated(true);

        const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
        console.log("✅ User Email from localStorage:", email);
        setUserEmail(email);
    }, []);

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

                if (data.length === 0) {
                    console.log("🚀 No more unanswered questions.");
                    setAllAnswered(true);
                    setShowConfetti(true); // 🎉 Trigger confetti when done
                } else {
                    setQuestions(data);
                    setCurrentIndex(0);
                    setAnsweredCount(0); // ✅ Reset answered count
                    setUnansweredCount(data.length); // ✅ Store unanswered question count
                    console.log("✅ First question set:", data[0]);
                }
            } catch (error) {
                console.error("❌ Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUnansweredQuestions();
    }, [hydrated, userEmail]);

    const handleAnswer = async (questionId, answer) => {
        try {
            console.log(`📝 User answered: ${answer} for question: ${questionId}`);

            await fetch("/api/save-answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, questionId, answer }),
            });

            setQuestions((prevQuestions) =>
                prevQuestions.filter((q) => q._id !== questionId)
            );

            setAnsweredCount((prevCount) => prevCount + 1); // ✅ Increase answered count

            if (currentIndex + 1 < questions.length) {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                setAllAnswered(true);
                setShowConfetti(true); // 🎉 Show confetti on last question
            }
        } catch (error) {
            console.error("❌ Error saving answer:", error);
        }
    };

    const handleSkip = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
            setAllAnswered(true);
            setShowConfetti(true); // 🎉 Show confetti when skipping last question
        }
    };

    const handleExit = () => {
        localStorage.removeItem("token");
        router.push("/StartSwipeButton");
    };

    if (!hydrated || loading) return <p>⏳ Loading questions...</p>;

    if (allAnswered) return (
        <div style={{ textAlign: "center", padding: "20px", position: "relative" }}>
            {showConfetti && <Confetti numberOfPieces={300} recycle={false} />} {/* 🎉 Confetti Animation */}
            <h2>🎉 Congratulations! You’ve reached the End!</h2>
            <p>Please check back later </p>
            <button 
                onClick={() => router.push("/StartSwipeButton")}
                style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}
            >
                Restart
            </button>
        </div>
    );

    if (!questions.length || !questions[currentIndex]) return <p>⚠️ No questions available.</p>;

    const currentQuestion = questions[currentIndex];

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", flexDirection: "column" }}>
            
            {/* Exit and Skip Buttons */}
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
                onMouseOver={(e) => {
                    e.target.style.transform = "scale(1.2) rotateY(10deg)";
                   e.target.style.filter = "drop-shadow(0px 0px 20px rgba(255, 0, 0, 0.6))"; // Red Glow Effect
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "scale(1) rotateY(0deg)";
                    e.target.style.filter = "none";
                  }}
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
                onMouseOver={(e) => {
                    e.target.style.transform = "scale(1.2) rotateY(-10deg)";
                   e.target.style.filter = "drop-shadow(0px 0px 20px rgba(0, 0, 255, 0.6))"; // Blue Glow Effect
                 }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "scale(1) rotateY(0deg)";
                    e.target.style.filter = "none";
                  }}

            />

            {/* Progress Bar with Answered / Unanswered Questions */}
            <div style={{ position: "absolute", bottom: "5%", width: "80%", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
                ✅ {answeredCount} / {unansweredCount} Questions Answered
            </div>
        </div>
    );
}
