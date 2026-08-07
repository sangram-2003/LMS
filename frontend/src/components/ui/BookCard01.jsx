import React from "react";
import { FaEdit } from "react-icons/fa";

import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function BookCard01({
  id,
  title = "Name of the book",
  category = "undefined",
  author = "author",
  ISBN= "1900",
  status = "",
  stock = 0,
  color = "bg-gray-400",
  className = "",
  handleOnDelete=()=>{},
 
  ...props
}) {
 
  const navigate = useNavigate();
  const handleOnUpdate =()=>{
   navigate(`/dashboard/update-book/${ISBN}`)
  }

  return (
    <div
      className={`group bg-white rounded-md border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${className}`}
      {...props}
    >
     
      <div
        className={`relative h-52 ${color} flex items-center justify-center text-white/80`}
      >
       <div className=" flex absolute top-2 w-full justify-end px-4 gap-5">
        <div className="">
          <button 
          onClick={handleOnUpdate}
          className="text-xl bg-white/60 flex justify-center items-center p-1 rounded-md text-green-700 cursor-pointer"><FaEdit /></button>

        </div>
        <div className="">
          <button 
         onClick={handleOnDelete}
          className="text-xl bg-white/60 flex justify-center items-center p-1 rounded-md text-red-700 cursor-pointer"><MdDelete /></button>

        </div>
       </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>

        {status && (
          <span className="absolute top-4 right-4 bg-amber-400 text-[10px] font-black px-2.5 py-1 rounded-lg text-white uppercase tracking-widest shadow-lg">
            {status}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
          {category}
        </span>

        <h3 className="font-bold text-slate-800 text-lg mt-2 leading-snug group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-400 mt-1">{author}</p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-bold tracking-tighter">
            {`ISBN: ${ISBN} `}
          </span>

          <span
            className={`text-[11px] px-3 py-1.5 rounded-xl font-black uppercase tracking-tight ${
              stock > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {stock} in stock
          </span>
        </div>
      </div>
    </div>
  );
}

export default BookCard01;