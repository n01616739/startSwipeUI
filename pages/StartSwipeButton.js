"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function StartSwipeButton() {
  const router = useRouter();

  return (
    <div 
      className="vh-100 vw-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "#0e1834", // Full-page dark blue background
        color: "white",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Ensure content is centered
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Animated Heading with Glow */}
      <motion.h1 
        initial={{ opacity: 0, y: -40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, ease: "easeOut" }} 
        style={{
          textShadow: "0px 0px 20px rgba(255, 255, 255, 0.8)", // White glow effect
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "15px"
        }}
      >
        Welcome to Swipe Challenge!
      </motion.h1>

      {/* Subtext Animation with Glow */}
      <motion.p
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          fontSize: "1.3rem",
          color: "#f8f9fa",
          marginBottom: "30px",
          fontWeight: "500",
          textShadow: "0px 0px 10px rgba(255, 255, 255, 0.6)" // Subtle glow effect
        }}
      >
        <strong>Let's Go Left</strong>, <strong>Right</strong>, or <strong>Just Skip</strong>.
      </motion.p>

      {/* Centered Animated Button */}
      <motion.button 
        onClick={() => router.push("/home")}
        initial={{ y: -200, opacity: 0 }} // Start from the top
        animate={{ y: 0, opacity: 1 }} // Drop into the center
        transition={{ duration: 1, ease: "easeOut" }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(255, 255, 255, 1)" }} // Brighter glow on hover
        whileTap={{ scale: 0.9 }}
        style={{
          background: "white", 
          color: "#0056b3",
          border: "none",
          padding: "20px 50px",
          fontSize: "1.5rem",
          borderRadius: "50px",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.8)", // **Initial glow**
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "1px",
          cursor: "pointer"
        }}
      >
        Start Swiping
      </motion.button>
    </div>
  );
}
