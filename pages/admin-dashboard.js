// pages/admin-dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwt.decode(token);
    if (decoded.role !== "admin") {
      router.push("/"); // Redirect to home if not an admin
    } else {
      setUser(decoded);
    }
  }, [router]);

  if (!user) return null; // Wait for user to be set

  return <div>Welcome to the Admin Dashboard, {user.name}</div>;
};

export default AdminDashboard;
