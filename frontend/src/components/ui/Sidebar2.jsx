import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar2() {
  const navigate = useNavigate();

 const handleLogout = () => {
  // 🔥 clear ALL stored data
  localStorage.clear();

  // 🔥 hard reload (VERY IMPORTANT)
  window.location.href = "/login";
};

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-md hover:bg-blue-100 cursor-pointer ${
      isActive ? "bg-blue-100 font-semibold" : ""
    }`;

  return (
    <div className="w-64 h-screen border-r p-5 flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-400 text-white p-2 rounded-md">
          📚
        </div>

        <div>
          <h2 className="font-bold text-gray-800">RKMGEC</h2>
          <p className="text-xs text-gray-500">Student Portal</p>
        </div>
      </div>

      {/* Menu */}
      <ul className="space-y-4 text-gray-700 flex-1">

        <NavLink to="/home" className={menuClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/books" className={menuClass}>
          🔍 Browse Books
        </NavLink>

        <NavLink to="/my-books" className={menuClass}>
          📖 My Books
        </NavLink>

        <NavLink to="/history" className={menuClass}>
          ⏰ History
        </NavLink>

        <NavLink to="/profile" className={menuClass}>
          👤 Profile
        </NavLink>

      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 text-white p-3 rounded-md hover:bg-red-600"
      >
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar2;