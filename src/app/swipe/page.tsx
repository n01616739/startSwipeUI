"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProgressIndicator from "@/components/ProgressIndicator";
import SkipButton from "@/components/SkipButton";

const questions = [
  { leftImage: "/images/coke.jpg", rightImage: "/images/pepsi.jpg" },
  { leftImage: "/images/image3.jpg", rightImage: "/images/image4.jpg" },
  { leftImage: "/images/image5.jpg", rightImage: "/images/image6.jpg" },
];

export default function SwipePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [logoPosition, setLogoPosition] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();
  const totalQuestions = questions.length;

  // Ref to store the audio instance
  const trumpetAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (completed) {
      trumpetAudioRef.current = new Audio("/sounds/trumpet.mp3");
      trumpetAudioRef.current.loop = true;
      trumpetAudioRef.current.play().catch(() => console.warn("Audio playback failed."));
    } else {
      // Stop audio when not completed
      if (trumpetAudioRef.current) {
        trumpetAudioRef.current.pause();
        trumpetAudioRef.current.currentTime = 0;
      }
    }

    // Add keydown event listener for left and right arrows
    const handleKeyDown = (event: KeyboardEvent) => {
      if (completed) return;
      if (event.key === "ArrowLeft") {
        handleChoice("left");
      } else if (event.key === "ArrowRight") {
        handleChoice("right");
      }
    };

    // Attach event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [completed, currentQuestion]);

  const finishChallenge = () => {
    setCompleted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleChoice = (direction: "left" | "right") => {
    if (completed) return;

    setIsRolling(true);
    setLogoPosition(direction === "left" ? -240 : 240);

    setTimeout(() => {
      setIsRolling(false);
      setLogoPosition(0);

      if (currentQuestion === totalQuestions - 1) {
        finishChallenge();
      } else {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 800);
  };

  const handleSkip = () => {
    if (completed) return;

    if (currentQuestion === totalQuestions - 1) {
      finishChallenge();
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Function to restart the game
  const restartGame = () => {
    setCurrentQuestion(0);
    setCompleted(false);
  };

  // Function to exit
  const exitGame = () => {
    router.push("/");
    setCompleted(false);
  };

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center position-relative"
      style={{
        background: "linear-gradient(-45deg, #121C3B, #1F2C5B, #162447)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 8s ease infinite",
        color: "white",
      }}
    >
      {showConfetti && <Confetti />}

      {/* SHOW CELEBRATION SCREEN IMMEDIATELY AFTER LAST QUESTION */}
      {completed ? (
        <div className="text-center">
          <h1 className="fw-bold text-success">🎉 Congratulations! 🎉</h1>
          <p className="fs-4">Would you like to try a new challenge?</p>
          <div className="mt-4">
            <button
              className="btn btn-primary mx-2 px-4 py-2 rounded-pill shadow-lg"
              onClick={restartGame}
            >
              Restart
            </button>
            <button
              className="btn btn-danger mx-2 px-4 py-2 rounded-pill shadow-lg"
              onClick={exitGame}
            >
              Exit
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* EXIT & SKIP BUTTONS (Hidden when completed) */}
          <div className="position-absolute top-0 end-0 m-3 d-flex justify-content-between w-100 px-3">
            <button
              className="btn btn-danger px-4 py-2 rounded-pill shadow-lg"
              onClick={exitGame}
            >
              Exit
            </button>
            <SkipButton onClick={handleSkip} />
          </div>

          {/* QUESTION SELECTION */}
          <div className="d-flex align-items-center gap-5 mt-5">
            {/* Left Choice */}
            {questions[currentQuestion]?.leftImage && (
              <div
                className="image-wrapper"
                style={{
                  width: "280px",
                  height: "400px",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handleChoice("left")}
              >
                <Image
                  src={questions[currentQuestion].leftImage}
                  alt="Left Choice"
                  fill
                  style={{ objectFit: "cover" }}
                  className="img-fluid rounded"
                />
              </div>
            )}

            {/* Logo in the Middle */}
            <motion.div
              className="d-flex justify-content-center position-relative"
              animate={{ x: logoPosition, rotate: isRolling ? 720 : 0 }}
              transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
              style={{ zIndex: 10 }}
            >
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-circle shadow-lg bg-white p-2"
              />
            </motion.div>

            {/* Right Choice */}
            {questions[currentQuestion]?.rightImage && (
              <div
                className="image-wrapper"
                style={{
                  width: "280px",
                  height: "400px",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handleChoice("right")}
              >
                <Image
                  src={questions[currentQuestion].rightImage}
                  alt="Right Choice"
                  fill
                  style={{ objectFit: "cover" }}
                  className="img-fluid rounded"
                />
              </div>
            )}
          </div>

          {/* PROGRESS BAR (Hidden when completed) */}
          {!completed && (
            <ProgressIndicator
              progress={((currentQuestion + 1) / totalQuestions) * 100}
              current={Math.min(currentQuestion + 1, totalQuestions)}
              total={totalQuestions}
            />
          )}
        </>
      )}
    </div>
  );
}
