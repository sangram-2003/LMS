import React from "react";
import { MdOutlineDelete } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";

function StudentCard01({
  name,
  email,
  department,
  joinDate,
  stats,
  currentBook,
}) {
  return (
    <div className="group p-3 px-4 bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      
      {/* Top */}
      <div className="flex gap-2 h-16 w-full justify-between">
        <div className="bg-red-400 w-2/12 flex justify-center items-center rounded-md">
          <h2 className="text-3xl font-semibold text-white">
            {name.charAt(0)}
          </h2>
        </div>

        <div className="w-9/12 flex flex-col justify-center">
          <h2 className="text-xl text-black font-medium">{name}</h2>
          <p className="text-md text-gray-700">{email}</p>
        </div>

        <div className="w-1/12 flex justify-end text-xl text-red-900 cursor-pointer">
          <MdOutlineDelete />
        </div>
      </div>

      {/* Info */}
      <div className="mt-4">
        <h2 className="text-lg flex items-center gap-3 text-gray-600 font-medium">
          <FaGraduationCap /> {department}
        </h2>
        <p className="text-sm text-gray-700">
          Join : <span>{joinDate}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="flex mt-3 h-14">
        <div className="w-1/4 text-center">
          <h1>{stats.total}</h1>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="w-1/4 text-center">
          <h1 className="text-blue-700">{stats.active}</h1>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="w-1/4 text-center">
          <h1 className="text-green-700">{stats.returned}</h1>
          <p className="text-sm text-gray-600">Returned</p>
        </div>
        <div className="w-1/4 text-center">
          <h1 className="text-red-700">{stats.pending}</h1>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
      </div>

      {/* Current Book */}
      <div className="mt-4">
        <p className="text-sm text-gray-700 font-medium">
          Currently Reading
        </p>
        <p className="text-sm text-gray-700 mt-1 flex items-center gap-3">
          <IoBookSharp /> {currentBook}
        </p>
      </div>
    </div>
  );
}

export default StudentCard01;