import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaFilter, FaBookOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getRequests } from "../../features/issue/issueSlice";
import { getUsers } from "../../features/auth/authSlice";
import { getBooks } from "../../features/book/bookSlice";

function History() {
  const dispatch = useDispatch();

  const { requests } = useSelector((state) => state.issue);
  const { users } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.book);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load data
  useEffect(() => {
    dispatch(getRequests({ role: "admin" }));
    dispatch(getUsers());
    dispatch(getBooks());
  }, [dispatch]);

  // Merge + Overdue
  const mergedData = useMemo(() => {
    const today = new Date();

    return requests.map((item) => {
      const student = users.find(
        (u) => u.roll_number == item.student_roll_number
      );

      const book = books.find((b) => b.isbn == item.isbn);

      const dueDate = new Date(item.due_date + "T00:00:00");

      let finalStatus = item.status;

      // overdue logic
      if (
        item.status === "approved" &&
        item.return_status !== "returned" &&
        dueDate < today
      ) {
        finalStatus = "overdue";
      }

      return {
        ...item,
        studentName: student?.name || "Unknown",
        title: book?.title || "Unknown",
        finalStatus,
      };
    });
  }, [requests, users, books]);

  // Filter (FIXED)
  const filtered = mergedData
    .filter((r) => {
      const matchSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.studentName.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || r.finalStatus === statusFilter;

      return matchSearch && matchStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.issue_date).getTime() -
        new Date(a.issue_date).getTime()
    );

  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-blue-100 text-blue-700",
    returned: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
    rejected: "bg-gray-200 text-gray-600",
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen text-black">
      
      {/* 🔍 Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by book or student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <FaFilter className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["pending", "approved", "returned"].map((status) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(status === statusFilter ? "all" : status)
            }
            className={`bg-white rounded-xl border p-4 ${
              statusFilter === status
                ? "border-blue-400 shadow-md"
                : "border-slate-200"
            }`}
          >
            <p className="text-xl font-bold">
              {
                mergedData.filter(
                  (r) => r.finalStatus === status
                ).length
              }
            </p>
            <p className="text-xs capitalize">{status}</p>
          </button>
        ))}

        <button
          onClick={() => setStatusFilter("all")}
          className="bg-white rounded-xl border p-4"
        >
          <p className="text-xl font-bold">{mergedData.length}</p>
          <p className="text-xs">Total</p>
        </button>
      </div>

      
      <div className="bg-white rounded-xl overflow-hidden border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Book</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3">Borrow</th>
              <th className="p-3">Due</th>
              <th className="p-3">Return</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((record) => (
              <tr key={record.issue_id} className="border-t">
                <td className="p-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <FaBookOpen className="text-white text-xs" />
                  </div>
                  {record.title}
                </td>

                <td className="p-3">{record.studentName}</td>
                <td className="p-3">{record.issue_date}</td>
                <td className="p-3">{record.due_date}</td>
                <td className="p-3">
                  {record.return_status === "returned" ? "Returned" : "—"}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      statusColors[record.finalStatus]
                    }`}
                  >
                    {record.finalStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-6">
            <FaBookOpen className="mx-auto text-gray-300 mb-2" />
            <p>No records found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;