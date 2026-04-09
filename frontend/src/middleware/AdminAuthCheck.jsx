import React from "react";
import { Navigate } from "react-router-dom";

function AdminAuthCheck({ children }) {
  const storedStaff = localStorage.getItem("staffUser");

  // ❌ No user
  if (!storedStaff) {
    return <Navigate to="/home" />;
  }

  const user = JSON.parse(storedStaff);

  // ❌ Not logged in
  if (!user.isLoggedIn) {
    return <Navigate to="/home" />;
  }

  // ❌ Not admin or librarian
  if (user.role !== "admin" && user.role !== "librarian") {
    return <Navigate to="/home" />;
  }

  // ✅ Access allowed
  return children;
}

export default AdminAuthCheck;