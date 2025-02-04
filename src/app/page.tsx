"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function StartPage() {
  const router = useRouter();

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #121C3B, #1F2C5B, #162447)",
        color: "white",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Floating Card with Glassmorphism Effect (No Borders) */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center p-5 shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.1)", // Light transparent background
          backdropFilter: "blur(10px)", // Glass effect
          borderRadius: "20px", // Smooth rounded edges
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)", // Soft floating shadow
          padding: "40px 60px"
        }}
      >
        {/* Animated Text Drop-In */}
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
          style={{
            textShadow: "0px 4px 10px rgba(255, 255, 255, 0.5)",
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "20px"
          }}
        >
          Welcome to Swipe Challenge!
        </motion.h1>

        {/* Perfectly Centered Button with 3D Hover Effect */}
        <motion.button 
          onClick={() => router.push("/swipe")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "15px 30px",
            fontSize: "1.2rem",
            borderRadius: "50px",
            transition: "transform 0.2s ease-in-out",
            boxShadow: "0px 5px 15px rgba(0, 123, 255, 0.4)",
          }}
        >
          Start Swiping
        </motion.button>
      </motion.div>
    </div>
  );
}
