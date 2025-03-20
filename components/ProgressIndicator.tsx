"use client";
import { motion } from "framer-motion";
import React from "react";  // ✅ Explicitly import React

export default function ProgressIndicator({ progress, current, total }: { progress: number, current: number, total: number }) {
  return (
    <div className="mt-4 w-100 text-center">
      <p className="fw-bold fs-5" style={{ color: "red" }}> {/* Red color for progress text */}
        {current}/{total} answered
      </p>
      <div className="progress mx-auto w-75" style={{ height: "10px", borderRadius: "5px", overflow: "hidden" }}>
        <motion.div 
          className="progress-bar bg-success" 
          initial={{ width: "0%" }} 
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 0.5 }}>
        </motion.div>
      </div>
    </div>
  );
}
