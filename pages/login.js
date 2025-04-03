

"use client"; // 

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log("🧹 Clearing previous sessions...");

    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Optional: Clear cache storage (for PWA)
    if ("caches" in window) {
      caches.keys().then((names) => {
        for (let name of names) caches.delete(name);
      });
    }

    console.log("✅ Session cleaned");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("🔑 Attempting login for:", email);

    try {
      const response = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log(" Login successful. Storing token & user email...");

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
      console.error(" Login error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login to Your Account</h2>

        {error && <p className="alert alert-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
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
    </div>
  );
};

export default Login;
