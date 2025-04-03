"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const validateEmail = (email) => {
    // Basic email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    const response = await fetch("/api/auth/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      router.push("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        background: "linear-gradient(to right, #667eea, #764ba2)",
        color: "#333",
        fontFamily: "Segoe UI, sans-serif",
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

      {/* Registration Form */}
      <main className="d-flex justify-content-center align-items-center flex-grow-1">
        <div
          className="card shadow-lg p-4"
          style={{
            maxWidth: "500px",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
          }}
        >
       

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                ref={nameInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                placeholder="Enter your email"
              />
              {emailError && (
                <div className="invalid-feedback">{emailError}</div>
              )}
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

            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
            >
              Register
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Already have an account? </span>
            <a href="/login" className="text-primary">Login</a>
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
    </div>
  );
};

export default Register;
