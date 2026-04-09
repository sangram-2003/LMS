import React from "react";
import { Navigate } from "react-router-dom";

function UserAuthCheck({ children }) {
  // ✅ Get user from localStorage
  const storedUser = localStorage.getItem("user");

  // ❌ If no user
  if (!storedUser) {
    return <Navigate to="/" />;
  }

  const user = JSON.parse(storedUser);

  // ❌ If not logged in
  if (!user.isLoggedIn) {
    return <Navigate to="/" />;
  }

  // ✅ Allow access
  return children;
}

export default UserAuthCheck;
