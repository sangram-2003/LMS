import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice"; 
import { useNavigate } from "react-router-dom";
function Sidebar2() {
  const dispatch = useDispatch();
  const [active, setActive] = useState("dashboard");
  const { isLoggedIn, loading } = useSelector(state => state.auth);
  const navigate = useNavigate();
 const handleLogout = () => {
  dispatch(logout());
  navigate("/");
};

console.log(isLoggedIn)

  return (
    <div className="w-64 h-screen relative border-r p-5 ">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-400 text-white p-2 rounded-md">📚</div>
        <div>
          <h2 className="font-bold text-gray-800">RKMGEC</h2>
          <p className="text-xs text-gray-500">Admin Portal</p>
        </div>
      </div>

      <ul className="space-y-4 text-gray-700">
        <NavLink to="/dashboard">
          <li
            onClick={() => setActive("dashboard")}
            className={`flex items-center gap-3 p-3 rounded-md hover:bg-blue-100 cursor-pointer ${
              active === "dashboard" ? "bg-blue-100" : ""
            }`}
          >
            📊 Dashboard
          </li>
        </NavLink>

        <NavLink to="/dashboard/books">
          <li
            onClick={() => setActive("manage books")}
            className={`flex items-center gap-3 p-3 rounded-md hover:bg-blue-100 cursor-pointer ${
              active === "manage books" ? "bg-blue-100" : ""
            }`}
          >
            🔍 Manage Books
          </li>
        </NavLink>

        <NavLink to="/dashboard/members">
          <li
            onClick={() => setActive("manage students")}
            className={`flex items-center gap-3 p-3 rounded-md hover:bg-blue-100 cursor-pointer ${
              active === "manage students" ? "bg-blue-100" : ""
            }`}
          >
            📖 Manage Students
          </li>
        </NavLink>

       <NavLink to="/dashboard/staff">
          <li
            onClick={() => setActive("manage staff")}
            className={`flex items-center gap-3 p-3 rounded-md hover:bg-blue-100 cursor-pointer ${
              active === "manage staff" ? "bg-blue-100" : ""
            }`}
          >
            📖 Manage Staff
          </li>
        </NavLink>
        <NavLink to="/dashboard/reports">
          <li
            onClick={() => setActive("requests")}
            className={`flex items-center gap-3 p-3 rounded-md hover:bg-blue-100 cursor-pointer ${
              active === "requests" ? "bg-blue-100" : ""
            }`}
          >
            ⏰ Requests
          </li>
        </NavLink>

        <NavLink to="/dashboard/history">
          <li
            onClick={() => setActive("history")}
            className={`flex items-center gap-3 p-3 rounded-md hover:bg-blue-100 cursor-pointer ${
              active === "history" ? "bg-blue-100" : ""
            }`}
          >
            ⏰ History
          </li>
        </NavLink>
      </ul>

      {/* Logout Button */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          disabled={loading}
          className="absolute bottom-8 bg-pink-500 w-10/12 py-2 rounded-md cursor-pointer text-md font-semibold text-center"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      )}
    </div>
  );
}

export default Sidebar2;