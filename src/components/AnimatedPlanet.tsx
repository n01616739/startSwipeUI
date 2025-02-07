"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Planet } from "react-kawaii"; // 🌍 Import the planet

const AnimatedPlanet = () => {
  const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [planetPosition, setPlanetPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [speed, setSpeed] = useState(0.2);
  const [isMoving, setIsMoving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      const dx = Math.abs(e.movementX);
      const dy = Math.abs(e.movementY);
      setSpeed(Math.min(0.7, Math.max(0.05, (dx + dy) / 50))); // Adjust speed dynamically
    };

    const handleMouseStop = () => {
      setIsMoving(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseStop);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseStop);
    };
  }, []);

  useEffect(() => {
    const movePlanet = () => {
      setPlanetPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * (isMoving ? speed : 0.03),
        y: prev.y + (mousePosition.y - prev.y) * (isMoving ? speed : 0.03),
      }));
    };

    const interval = setInterval(movePlanet, 10);
    return () => clearInterval(interval);
  }, [mousePosition, speed, isMoving]);

  if (!isClient) return null;

  return (
    <motion.div
      className="planet-container"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: 10, // **Ensures planet is always above images**
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        x: planetPosition.x - window.innerWidth / 2,
        y: planetPosition.y - window.innerHeight / 2,
        rotate: [0, 2160], // Super fast spinning
      }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    >
      <Planet size={200} mood="happy" color="#85D2D0" />
    </motion.div>
  );
};

export default AnimatedPlanet;
