"use client";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProgressIndicator from "@/components/ProgressIndicator";
import SkipButton from "@/components/SkipButton";

const questions = [
  { leftImage: "/images/coke.jpg", rightImage: "/images/pepsi.jpg" },
  { leftImage: "/images/image3.jpg", rightImage: "/images/image4.jpg" },
  { leftImage: "/images/image5.jpg", rightImage: "/images/image6.jpg" },
];

export default function SwipePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const router = useRouter();
  const totalQuestions = questions.length;

  const finishChallenge = () => {
    setCompleted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleChoice = (dir: "left" | "right") => {
    if (completed) return;
    setDirection(dir);

    setTimeout(() => {
      if (currentQuestion === totalQuestions - 1) {
        finishChallenge();
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setDirection(null);
      }
    }, 500);
  };

  const handleSkip = () => {
    if (currentQuestion === totalQuestions - 1) {
      finishChallenge();
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const restartGame = () => {
    window.location.reload(); // **Forces a full page reload**
  };

  const exitGame = () => {
    router.push("/");
    setCompleted(false);
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center position-relative">
      {showConfetti && <Confetti />}

      {/* Exit & Skip Buttons */}
      <div className="position-absolute top-0 end-0 m-3 d-flex justify-content-between w-100 px-3">
        <button className="btn btn-danger px-4 py-2 rounded-pill shadow-lg" onClick={exitGame}>
          Exit
        </button>
        <SkipButton onClick={handleSkip} />
      </div>

      {completed ? (
        <div className="text-center">
          <h1 className="fw-bold text-success">🎉 Congratulations! 🎉</h1>
          <p className="fs-4">Would you like to try a new challenge?</p>
          <div className="mt-4">
            <button className="btn btn-primary mx-2 px-4 py-2 rounded-pill shadow-lg" onClick={restartGame}>
              Restart
            </button>
            <button className="btn btn-danger mx-2 px-4 py-2 rounded-pill shadow-lg" onClick={exitGame}>
              Exit
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between w-100 px-5 mt-5">
            {/* Left Swiping Image */}
            <motion.div
              className="image-container"
              onClick={() => handleChoice("left")}
              onMouseEnter={() => setHoverSide("left")}
              onMouseLeave={() => setHoverSide(null)}
              initial={{ x: 0, opacity: 1 }}
              animate={direction === "left" ? { x: "-100vw", opacity: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                boxShadow: hoverSide === "left" ? "0px 0px 20px rgba(0, 255, 0, 0.8)" : "none",
                transform: hoverSide === "left" ? "scale(1.05)" : "scale(1)",
                transition: "0.3s ease-in-out",
              }}
            >
              <img
                src={questions[currentQuestion].leftImage}
                alt="Left"
                className="img-fluid rounded shadow-lg"
                style={{ cursor: "pointer" }}
              />
            </motion.div>

            {/* Animated Swipe Trail */}
            <motion.div
              className="swipe-trail"
              animate={{
                scale: direction ? 1.2 : 1,
                rotate: direction === "left" ? -15 : direction === "right" ? 15 : 0,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div
                animate={{ opacity: direction ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: direction === "left" ? "#ff4d4d" : "#4CAF50",
                }}
              >
                {direction === "left" ? "👈 Swipe Left" : direction === "right" ? "Swipe Right 👉" : ""}
              </motion.div>
            </motion.div>

            {/* Right Swiping Image */}
            <motion.div
              className="image-container"
              onClick={() => handleChoice("right")}
              onMouseEnter={() => setHoverSide("right")}
              onMouseLeave={() => setHoverSide(null)}
              initial={{ x: 0, opacity: 1 }}
              animate={direction === "right" ? { x: "100vw", opacity: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                boxShadow: hoverSide === "right" ? "0px 0px 20px rgba(0, 255, 0, 0.8)" : "none",
                transform: hoverSide === "right" ? "scale(1.05)" : "scale(1)",
                transition: "0.3s ease-in-out",
              }}
            >
              <img
                src={questions[currentQuestion].rightImage}
                alt="Right"
                className="img-fluid rounded shadow-lg"
                style={{ cursor: "pointer" }}
              />
            </motion.div>
          </div>

          {/* Progress Bar */}
          <ProgressIndicator
            progress={((currentQuestion + 1) / totalQuestions) * 100}
            current={currentQuestion + 1}
            total={totalQuestions}
          />
        </>
      )}
    </div>
  );
}
