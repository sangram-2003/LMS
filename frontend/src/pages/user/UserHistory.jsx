import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
   const user = JSON.parse(localStorage.getItem("user"));
 console.log("user roll number ", user)
  const rollNumber = user?.roll_number;

  //  Fetch data
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost/LMS/Api/issue/getRequests.php",
        {
          params: {
            role: "student",
            roll_number: rollNumber,
          },
        }
      );
      console.log(res.data)
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  //  Normalize status (IMPORTANT FIX)
  const getStatus = (item) => {
    if (item.return_status === "returned") return "returned";
    if (item.status === "approved") return "issued";
    if (item.status === "pending") return "pending";
    if (item.status === "rejected") return "rejected";
    console.log(item.status)
    return "unknown";
  };

  //  FILTER
  const filteredHistory = history.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const author = item.author?.toLowerCase() || "";

    const matchesSearch =
      title.includes(search.toLowerCase()) ||
      author.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || getStatus(item) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  //  COUNTS (FIXED)
  const pending = history.filter((b) => getStatus(b) === "pending").length;
  const active = history.filter((b) => getStatus(b) === "issued").length;
  const returned = history.filter((b) => getStatus(b) === "returned").length;

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800">

      <h1 className="text-2xl font-bold mb-6"> History</h1>

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search your history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72 bg-white"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white text-sm"
        >
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="issued">Issued</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/*  STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl text-center shadow">
          <div className="text-2xl font-bold">{pending}</div>
          <div className="text-gray-400">Pending</div>
        </div>

        <div className="bg-white p-6 rounded-xl text-center shadow">
          <div className="text-2xl font-bold">{active}</div>
          <div className="text-gray-400">Issued</div>
        </div>

        <div className="bg-white p-6 rounded-xl text-center shadow">
          <div className="text-2xl font-bold">{returned}</div>
          <div className="text-gray-400">Returned</div>
        </div>
      </div>

      {/*  LIST */}
      <div className="flex flex-col gap-4">

        {filteredHistory.map((item) => {
          const currentStatus = getStatus(item);

          return (
            <div
              key={item.issue_id}
              className="flex justify-between bg-white p-4 rounded-xl shadow"
            >
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.author || "Unknown"}</p>

                <p className="text-xs mt-1">
                  Borrowed: {item.issue_date}
                </p>

                {item.due_date && (
                  <p className="text-xs">
                    Due: {item.due_date}
                  </p>
                )}

                {item.return_date && (
                  <p className="text-xs text-green-600">
                    Returned: {item.return_date}
                  </p>
                )}
              </div>

              {/*  STATUS */}
              <div>
                {currentStatus === "pending" && (
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs">
                    Pending
                  </span>
                )}

                {currentStatus === "issued" && (
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                    Issued
                  </span>
                )}

                {currentStatus === "returned" && (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                    Returned
                  </span>
                )}

                {currentStatus === "rejected" && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
                    Rejected
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredHistory.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No history found 
          </p>
        )}

      </div>
    </div>
  );
}