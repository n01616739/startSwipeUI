"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!leftImage || !rightImage) {
      setMessage("❗ Please select both images before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file_left", leftImage);
    formData.append("file_right", rightImage);

    try {
      const res = await fetch("/api/auth/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Images uploaded and pushed to users!");
        setLeftImage(null);
        setRightImage(null);
      } else {
        setMessage(`❌ Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      setMessage("❌ Something went wrong during upload.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>📤 Admin Dashboard - Upload Image Pair</h1>

      <div style={{ margin: "20px" }}>
        <label>Left Image: </label>
        <input type="file" accept="image/*" onChange={(e) => setLeftImage(e.target.files[0])} />
      </div>

      <div style={{ margin: "20px" }}>
        <label>Right Image: </label>
        <input type="file" accept="image/*" onChange={(e) => setRightImage(e.target.files[0])} />
      </div>

      <button
        onClick={handleUpload}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload & Push to Users
      </button>

      {message && <p style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}
