"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/router";
import { FaBell } from "react-icons/fa";
import Model from "@/components/dog";
import Confetti from "react-confetti";
import io from "socket.io-client";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [allAnswered, setAllAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [hoveredSide, setHoveredSide] = useState(null);
  const [newQuestionAvailable, setNewQuestionAvailable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
    const isAllAnswered = localStorage.getItem(`allAnswered_${email}`);
    if (isAllAnswered === "true") setAllAnswered(true);
  }, []);

  const fetchUnansweredQuestions = async (email) => {
    try {
      const res = await fetch(`/api/unanswered?email=${email}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setAllAnswered(true);
        setShowConfetti(true);
        localStorage.setItem(`allAnswered_${email}`, "true");
        return;
      }

      const shuffled = shuffleArray(data);
      setQuestions(shuffled);
      setAnsweredCount(0);
      setCurrentIndex(0);
      setAllAnswered(false);
    } catch (err) {
      console.error("❌ Error fetching questions:", err);
    } finally {
      setLoading(false);
      setNewQuestionAvailable(false);
    }
  };

  useEffect(() => {
    if (!hydrated || !userEmail) return;
    fetchUnansweredQuestions(userEmail);
  }, [hydrated, userEmail]);

  useEffect(() => {
    if (!userEmail) return;

    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("newImage", (newQuestionData) => {
      const exists = questions.some(q => q._id === newQuestionData._id);
      if (!exists) {
        setNewQuestionAvailable(true);
      }
    });

    return () => socket.disconnect();
  }, [userEmail, questions]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = async (questionId, answer) => {
    try {
      await fetch("/api/save-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, questionId, answer }),
      });

      const updated = questions.filter(q => q._id !== questionId);
      setQuestions(updated);
      setAnsweredCount(prev => prev + 1);

      if (updated.length === 0) {
        setAllAnswered(true);
        localStorage.setItem(`allAnswered_${userEmail}`, "true");
        setShowConfetti(true);
      } else {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("❌ Error saving answer:", error);
    }
  };

  const handleSkip = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setAllAnswered(true);
      setShowConfetti(true);
    }
  };

  const handleExit = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleBellClick = () => {
    if (userEmail) {
      fetchUnansweredQuestions(userEmail);
    }
  };

  if (allAnswered) {
    return (
      <div style={{ textAlign: "center", padding: "20px", position: "relative" }}>
        {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}
        <h2>🎉 All questions are done! Please come back later.</h2>
        <p>You've answered all available questions. Thank you!</p>
        <button onClick={handleBellClick} style={buttonStyle("#007bff")}>
          {newQuestionAvailable ? "🔔 New Question Available - Click to Refresh" : "Restart"}
        </button>
        <br />
        <button onClick={handleExit} style={{ ...buttonStyle("#ff4d4d"), marginTop: "10px" }}>
          Logout
        </button>
      </div>
    );
  }

  if (!hydrated || loading) return <p>⏳ Loading questions...</p>;
  if (!questions.length || !questions[currentIndex]) return <p>⚠️ No questions available.</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={buttonStyle("#ff4d4d")} onClick={handleExit}>Exit</button>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button style={buttonStyle("#007bff")} onClick={handleSkip}>Skip</button>

        {/* 🔔 Bell Icon with Text Below */}
<div
  onClick={handleBellClick}
  style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
>
  <div style={{ position: "relative" }}>
  <FaBell size={24} style={{ color: "red" }} />  {newQuestionAvailable && (
      <div style={{
        position: "absolute",
        top: -2,
        right: -2,
        backgroundColor: "red",
        borderRadius: "50%",
        width: "10px",
        height: "10px"
      }}></div>
    )}
  </div>
  <span style={{
    fontSize: "12px",
    color: "black",
    marginTop: "4px",
    textAlign: "center"
  }}>
    Stay updated!
  </span>
</div>

          
        </div>
      </div>

      {/* LEFT Image */}
      <img
        src={`/images/${currentQuestion.image_left}`}
        alt="Left Option"
        style={{
          ...imageBaseStyle,
          left: "10%",
          filter: hoveredSide === "left" ? "drop-shadow(0 0 15px red)" : "none"
        }}
        onClick={() => handleAnswer(currentQuestion._id, "left")}
        onMouseEnter={() => setHoveredSide("left")}
        onMouseLeave={() => setHoveredSide(null)}
      />

      {/* 3D Model */}
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          pointerEvents: "none"
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <OrbitControls />
        <Model scale={0.15} />
      </Canvas>

      {/* RIGHT Image */}
      <img
        src={`/images/${currentQuestion.image_right}`}
        alt="Right Option"
        style={{
          ...imageBaseStyle,
          right: "10%",
          filter: hoveredSide === "right" ? "drop-shadow(0 0 15px red)" : "none"
        }}
        onClick={() => handleAnswer(currentQuestion._id, "right")}
        onMouseEnter={() => setHoveredSide("right")}
        onMouseLeave={() => setHoveredSide(null)}
      />

      <div style={progressStyle}>
        ✅ {answeredCount} / {questions.length} Questions Answered
      </div>
    </div>
  );
}

// 🔧 Styles
const containerStyle = {
  width: "100vw",
  height: "100vh",
  background: "#f0f0f0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  flexDirection: "column"
};

const headerStyle = {
  position: "absolute",
  top: "10px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 20px",
  zIndex: 10
};

const buttonStyle = (bgColor) => ({
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "5px"
});

const imageBaseStyle = {
  position: "absolute",
  bottom: "30%",
  cursor: "pointer",
  width: "350px",
  height: "350px",
  transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out",
  zIndex: 10
};

const progressStyle = {
  position: "absolute",
  bottom: "5%",
  width: "80%",
  textAlign: "center",
  fontSize: "18px",
  fontWeight: "bold"
};
