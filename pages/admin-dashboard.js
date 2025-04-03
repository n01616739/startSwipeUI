// "use client";

// import { useState } from "react";

// export default function AdminDashboard() {
//   const [leftImage, setLeftImage] = useState(null);
//   const [rightImage, setRightImage] = useState(null);
//   const [message, setMessage] = useState("");

//   const handleUpload = async () => {
//     if (!leftImage || !rightImage) {
//       setMessage("❗ Please select both images before uploading.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file_left", leftImage);
//     formData.append("file_right", rightImage);

//     try {
//       const res = await fetch("/api/auth/admin/upload-image", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("✅ Images uploaded and pushed to users!");
//         setLeftImage(null);
//         setRightImage(null);
//       } else {
//         setMessage(`❌ Upload failed: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("❌ Upload error:", error);
//       setMessage("❌ Something went wrong during upload.");
//     }
//   };

//   return (
//     <div style={{ padding: "2rem", textAlign: "center" }}>
//       <h1>📤 Admin Dashboard - Upload Image Pair</h1>

//       <div style={{ margin: "20px" }}>
//         <label>Left Image: </label>
//         <input type="file" accept="image/*" onChange={(e) => setLeftImage(e.target.files[0])} />
//       </div>

//       <div style={{ margin: "20px" }}>
//         <label>Right Image: </label>
//         <input type="file" accept="image/*" onChange={(e) => setRightImage(e.target.files[0])} />
//       </div>

//       <button
//         onClick={handleUpload}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#28a745",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Upload & Push to Users
//       </button>

//       {message && <p style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</p>}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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
        setMessage(" Images uploaded and pushed to users!");
        setLeftImage(null);
        setRightImage(null);
      } else {
        setMessage(` Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error(" Upload error:", error);
      setIsUploading(false);
      setMessage("Something went wrong during upload.");
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
        <img
          src="/logo.png" // Replace with actual logo path
          alt="Logo"
          style={{ height: "40px" }}
        />
        <h2 style={{ margin: 0 }}>Upload Image</h2>
        <button
          onClick={() => (window.location.href = "/login")}
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
            {isUploading ? "Uploading..." : "  Upload & Push to Users"}
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

