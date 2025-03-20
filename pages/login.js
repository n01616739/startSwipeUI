"use client"; // ✅ Ensures this runs on the client side

import { useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // ✅ Handle errors
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // ✅ Reset error before making request

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

      console.log("✅ Login successful. Storing token & user email...");

      // ✅ Store JWT token and user email in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);

      // ✅ Decode the JWT token to check the role
      const decoded = jwt.decode(data.token);
      console.log("📜 Decoded Token:", decoded);

      // ✅ Redirect based on user role
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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login to Your Account</h2>

        {error && <p className="alert alert-danger text-center">{error}</p>} {/* ✅ Show error message */}

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

        {/* Registration Link */}
        <div className="text-center mt-4">
          <span className="text-muted">Don't have an account? </span>
          <a href="/register" className="text-primary">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
