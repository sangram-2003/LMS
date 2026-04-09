import React, { useEffect, useMemo } from "react";
import { FaRegClock, FaCheck } from "react-icons/fa";
import { LuBookOpen } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { getRequests, updateRequest, approveReturn } from "../../features/issue/issueSlice";
import { getUsers } from "../../features/auth/authSlice";
import { getBooks } from "../../features/book/bookSlice";

function Reports() {
  const dispatch = useDispatch();

  const { requests } = useSelector((state) => state.issue);
  const { users } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.book);

  
  useEffect(() => {
    dispatch(getRequests({ role: "admin" }));
    dispatch(getUsers());
    dispatch(getBooks());
  }, [dispatch]);

  //Approve / Reject
  const handleApprove = (id) => {
    dispatch(updateRequest({ issue_id: id, action: "approved" }));
  };

  const handleReject = (id) => {
    dispatch(updateRequest({ issue_id: id, action: "reject" }));
  };

 const handleApproveReturn = (id) => {
  dispatch(approveReturn(id));
};

  // Merge Data
  const mergedData = useMemo(() => {
    return requests.map((item) => {
      const student = users.find(
        (u) => u.roll_number == item.student_roll_number
      );

      const book = books.find((b) => b.isbn == item.isbn);

      return {
        ...item,
        studentInfo: student || {},
        available: book?.available || 0,
        total: book?.total || 0,
        title: book?.title || "Unknown",
        author: book?.author || "Unknown",
      };
    });
  }, [requests, users, books]);

  // Filters
  const pendingReq = mergedData.filter(
    (item) => item.status === "pending"
  );

  const returnRed = mergedData.filter(
    (item)=>item.return_status ==='pending'
  )

  const activeLoans = mergedData.filter(
    (item) =>
      item.status === "approved" &&
      item.return_status !== "returned"
  );
 
  const overdueLoans = mergedData.filter((item) => {
    const today = new Date();
    const dueDate = new Date(item.due_date + "T00:00:00");

    return (
      item.status === "approved" &&
      item.return_status !== "returned" &&
      dueDate < today
    );
  });

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen text-black">

      {/*Pending Requests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
          <h3 className="text-lg font-bold">
            Pending Requests ({pendingReq.length})
          </h3>
        </div>

        {pendingReq.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-xl">
            <FaRegClock className="mx-auto mb-2 text-gray-300" />
            <p>No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReq.map((record) => (
              <div
                key={record.issue_id}
                className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{record.title}</h4>
                  <p className="text-sm text-gray-500">{record.author}</p>

                  <div className="text-xs flex gap-4 mt-2">
                    <span>
                      Student: {record.studentInfo?.name}
                    </span>
                    <span>
                      {record.issue_date} → {record.due_date}
                    </span>
                    <span className="text-green-600">
                      Stock: {record.available}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(record.issue_id)}
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FaCheck /> Approve
                  </button>

                  <button
                    onClick={() => handleReject(record.issue_id)}
                    className="border border-red-300 text-red-600 px-3 py-1 rounded flex items-center gap-1"
                  >
                    <RxCross2 /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        {/* return  Requests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
          <h3 className="text-lg font-bold">
            Return Requests ({returnRed.length})
          </h3>
        </div>

        {returnRed.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-xl">
            <FaRegClock className="mx-auto mb-2 text-gray-300" />
            <p>No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {returnRed.map((record) => (
              <div
                key={record.issue_id}
                className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{record.title}</h4>
                  <p className="text-sm text-gray-500">{record.author}</p>

                  <div className="text-xs flex gap-4 mt-2">
                    <span>
                      Student: {record.studentInfo?.name}
                    </span>
                    <span>
                      {record.issue_date} → {record.due_date}
                    </span>
                    <span className="text-green-600">
                      Stock: {record.available}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveReturn(record.issue_id)}
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FaCheck /> Approve
                  </button>

                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/*Active Loans*/}
      <div>
        <h3 className="text-lg font-bold mb-4">
          Active Loans ({activeLoans.length})
        </h3>

        {activeLoans.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-xl">
            <LuBookOpen className="mx-auto mb-2 text-gray-300" />
            <p>No active loans</p>
          </div>
        ) : (
          <table className="w-full bg-white rounded-xl overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Book</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3">Borrow</th>
                <th className="p-3">Due</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {activeLoans.map((record) => {
                const isOverdue =
                  new Date(record.due_date) < new Date();

                return (
                  <tr key={record.issue_id} className="border-t">
                    <td className="p-3">{record.title}</td>
                    <td className="p-3">
                      {record.studentInfo?.name}
                    </td>
                    <td className="p-3">{record.issue_date}</td>
                    <td className="p-3">{record.due_date}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          isOverdue
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {isOverdue ? "Overdue" : "Active"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/*Overdue Loans*/}
      <div>
        <h3 className="text-lg font-bold mb-4">
          Overdue Loans ({overdueLoans.length})
        </h3>

        {overdueLoans.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-xl">
            <LuBookOpen className="mx-auto mb-2 text-gray-300" />
            <p>No overdue loans</p>
          </div>
        ) : (
          <table className="w-full bg-white rounded-xl overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Book</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3">Borrow</th>
                <th className="p-3">Due</th>
              </tr>
            </thead>

            <tbody>
              {overdueLoans.map((record) => (
                <tr
                  key={record.issue_id}
                  className="border-t bg-red-50"
                >
                  <td className="p-3">{record.title}</td>
                  <td className="p-3">
                    {record.studentInfo?.name}
                  </td>
                  <td className="p-3">{record.issue_date}</td>
                  <td className="p-3 text-red-600 font-semibold">
                    {record.due_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reports;