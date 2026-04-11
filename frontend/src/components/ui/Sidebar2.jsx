import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiViewList } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";

function Sidebar2() {
  const navigate = useNavigate();
 const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

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
    <>
    <div className=" w-full md:w-64 h-20  justify-between  md:h-screen border-r p-5 flex flex-row md:flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 md:mb-8">
        <div className="bg-blue-400 text-white p-2 rounded-md">
          📚
        </div>

        <div>
          <h2 className="font-bold text-gray-800">RKMGEC</h2>
          <p className="text-xs text-gray-500">Student Portal</p>
        </div>
      </div>
     <div className=" block  md:hidden ">
      <button
          onClick={handleToggle}
          className="text-4xl text-black flex justify-center items-center"
        >
          {open ? <RxCross2 /> : <HiViewList />}
        </button>
     </div>
      {/* Menu */}
      <ul className="space-y-4 hidden md:block text-gray-700 flex-1">

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
        className="mt-auto bg-red-500 hidden md:block text-white p-3 rounded-md hover:bg-red-600"
      >
        🚪 Logout
      </button>

      
    </div>

    {
      open &&
      (
        
          <div className=" h-screen px-2   bg-white">
            <div className="flex flex-col h-full  justify-between ">
 <ul className="space-y-4 pt-10   text-gray-700 flex-1">

        <NavLink to="/home" 
        onClick={()=>setOpen(false)}
        className={menuClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/books"
        onClick={()=>setOpen(false)}
        className={menuClass}>
          🔍 Browse Books
        </NavLink>

        <NavLink to="/my-books"
        onClick={()=>setOpen(false)}
        className={menuClass}>
          📖 My Books
        </NavLink>

        <NavLink to="/history" 
        onClick={()=>setOpen(false)}
        className={menuClass}>
          ⏰ History
        </NavLink>

        <NavLink to="/profile"
        onClick={()=>setOpen(false)}
        className={menuClass}>
          👤 Profile
        </NavLink>

      </ul>
<div className=" h-36">
<button
        onClick={handleLogout}
        className="mt-auto w-full    bg-red-500  text-white p-3 rounded-md hover:bg-red-600"
      >
        🚪 Logout
      </button>
</div>
      
            </div>
 
          </div>
          
        
      )
       
    }
   
    </>
  );
}

export default Sidebar2;