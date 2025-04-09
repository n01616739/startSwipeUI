"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

export default function AdminDashboard() {
  const router = useRouter();
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const leftInputRef = useRef(null);
  const rightInputRef = useRef(null);

  // Protect the route
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      if (!decoded || decoded.role !== "admin") {
        router.push("/login");
      }
    } catch (err) {
      console.error("Token decode failed:", err);
      router.push("/login");
    }
  }, []);

  const handleUpload = async () => {
    if (!leftImage || !rightImage) {
      setMessage(" Please select both images before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file_left", leftImage);
    formData.append("file_right", rightImage);

    try {
      setIsUploading(true);
      const res = await fetch("/api/auth/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setIsUploading(false);

      if (res.ok) {
        setMessage("✅ Images uploaded and pushed to users!");
        setLeftImage(null);
        setRightImage(null);

        // Reset file input fields
        if (leftInputRef.current) leftInputRef.current.value = "";
        if (rightInputRef.current) rightInputRef.current.value = "";

        // Hide the success message after 4 seconds
        setTimeout(() => {
          setMessage("");
        }, 4000);
      } else {
        setMessage(`❌ Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      setIsUploading(false);
      setMessage("❌ Something went wrong during upload.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        background: "radial-gradient(circle at top left, #e0e7ff, #f8fafc)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#2c3e50",
          color: "white",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img src="/logo.png" alt="Logo" style={{ height: "40px" }} />
        <h2 style={{ margin: 0 }}>Upload Image</h2>
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>
            Upload Image Pair
          </h3>

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label style={{ fontWeight: "bold" }}>Left Image</label>
            <input
              ref={leftInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setLeftImage(e.target.files[0])}
              style={{
                display: "block",
                marginTop: "0.5rem",
                padding: "0.5rem",
                width: "100%",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
            <label style={{ fontWeight: "bold" }}>Right Image</label>
            <input
              ref={rightInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setRightImage(e.target.files[0])}
              style={{
                display: "block",
                marginTop: "0.5rem",
                padding: "0.5rem",
                width: "100%",
              }}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isUploading ? "not-allowed" : "pointer",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            {isUploading ? "Uploading..." : "Upload & Push to Users"}
          </button>

          {message && (
            <p
              style={{
                marginTop: "1.5rem",
                fontWeight: "bold",
                color: message.includes("✅")
                  ? "green"
                  : message.includes("❌")
                  ? "red"
                  : "#333",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "1rem",
          backgroundColor: "#2c3e50",
          color: "white",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Know Quest | All rights reserved
      </footer>
    </div>
  );
}
