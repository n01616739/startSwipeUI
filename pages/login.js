"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [bottomMessage, setBottomMessage] = useState(null);
  const router = useRouter();

  // ✅ Ref to email input for auto-focus
  const emailInputRef = useRef(null);

  useEffect(() => {
    console.log("🧹 Clearing previous sessions...");

    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    if ("caches" in window) {
      caches.keys().then((names) => {
        for (let name of names) caches.delete(name);
      });
    }

    console.log("✅ Session cleaned");

    // ✅ Auto-focus email on load
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBottomMessage(null);

    console.log("🔐 Attempting login for:", email);

    try {
      const response = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBottomMessage(data.message || "Login failed");

        // ✅ Clear fields and refocus email input
        setEmail("");
        setPassword("");
        setTimeout(() => {
          setBottomMessage(null);
        }, 5000);

        if (emailInputRef.current) {
          emailInputRef.current.focus();
        }

        return;
      }

      console.log("✅ Login successful. Storing token & user email...");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);

      const decoded = jwt.decode(data.token);
      console.log("📜 Decoded Token:", decoded);

      if (decoded.role === "user") {
        router.push("/StartSwipeButton");
      } else if (decoded.role === "admin") {
        router.push("/admin-dashboard");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError(error.message);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        background: "linear-gradient(to right, #667eea, #764ba2)",
        color: "#333",
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        className="d-flex justify-content-between align-items-center p-3 px-4"
        style={{
          backgroundColor: "#ffffffcc",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <h5 className="m-0 fw-bold text-dark">Know Quest</h5>
        </div>
      </header>

      {/* Login Card */}
      <main className="d-flex justify-content-center align-items-center flex-grow-1">
        <div
          className="card shadow-lg p-4"
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
          }}
        >
          {/* <div className="text-center mb-2">
            <span
              className="badge bg-primary rounded-pill px-3 py-2"
              style={{
                fontSize: "1rem",
                letterSpacing: "0.5px",
              }}
            >
              Login
            </span>
          </div> */}

      

          {error && (
            <p className="alert alert-danger text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                ref={emailInputRef} // ✅ attach ref
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mb-3"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account? </span>
            <a href="/register" className="text-primary">Register</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-3"
        style={{
          backgroundColor: "#ffffffcc",
          fontSize: "0.9rem",
          color: "#555",
        }}
      >
        © {new Date().getFullYear()} Know Quest — All rights reserved.
      </footer>

      {/* Bottom floating error message */}
      {bottomMessage && (
        <div
          className="alert alert-danger text-center"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "400px",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            fontWeight: "500",
          }}
        >
          {bottomMessage}
        </div>
      )}
    </div>
  );
};

export default Login;
