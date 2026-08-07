import React, { useEffect, useState } from 'react'
import { useDispatch , useSelector } from 'react-redux';
import { getUsers } from "../../features/auth/authSlice";
import { getBooks } from "../../features/book/bookSlice";
import { getRequests, updateRequest } from "../../features/issue/issueSlice";
function Dashboard() {
  const dispatch = useDispatch();

   const { users } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.book);
   const { requests } = useSelector((state) => state.issue);
   useEffect(() => {
     dispatch(getRequests({ role: "admin" }));
    dispatch(getUsers());
    dispatch(getBooks());
  }, [dispatch]);

 const totalBook = books.reduce((acc, book) => acc + Number(book.total), 0);
  const totalAvailable = books.reduce((acc,book)=>acc + Number(book.available),0);

const totalPendingBooks = requests.reduce((acc, request) => {
  return request.status === "pending" ? acc + 1 : acc;
}, 0);

const totalReturnedBooks = requests.reduce((acc, request) => {
  return request.return_status === "returned" ? acc + 1 : acc;
}, 0);

 const totalActiveLoans = requests.reduce((acc ,request)=>{
   return request.status === "approved" && request.return_status !== "returned" ? acc + 1 : acc;
 },0
  );

  const totalStudents = users.length;
  // console.log("total books",totalBook , "available", totalAvailable , totalPendingBooks , totalReturnedBooks, totalActiveLoans);
   return (
        <div className="flex-1 px-6 py-3  min-h-screen">

      
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        Dashboard
      </h1>
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Books</p>
            <h2 className="text-3xl font-bold text-black">{totalBook}</h2>
          </div>

          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg text-xl">
            📘
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-gray-500">Available</p>
            <h2 className="text-3xl font-bold text-green-600">{totalAvailable}</h2>
          </div>

          <div className="bg-green-100 text-green-600 p-3 rounded-lg text-xl">
            ✔
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-gray-500">Students</p>
            <h2 className="text-3xl font-bold text-purple-600">{totalStudents}</h2>
          </div>

          <div className="bg-purple-100 text-purple-600 p-3 rounded-lg text-xl">
            👤
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-600">{totalPendingBooks}</h2>
          </div>

          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg text-xl">
            ⏰
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-gray-500">Active Loans</p>
            <h2 className="text-3xl font-bold text-pink-600">{totalActiveLoans}</h2>
          </div>

          <div className="bg-pink-100 text-pink-600 p-3 rounded-lg text-xl">
            📈
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-gray-500">Returned</p>
            <h2 className="text-3xl font-bold text-teal-600">{totalReturnedBooks}</h2>
          </div>

          <div className="bg-teal-100 text-teal-600 p-3 rounded-lg text-xl">
            ⚠
          </div>
        </div>

      </div>

    </div>
    
  )
}

export default Dashboard