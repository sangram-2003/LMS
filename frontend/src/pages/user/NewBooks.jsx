import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

function NewBooks() {
  const [requests, setRequests] = useState([]);

 const user = JSON.parse(localStorage.getItem("user"));
 console.log("user roll number ", user)
  const rollNumber = user?.roll_number;

  //  Fetching user requestes
  const fetchRequests = async () => {
    if (!rollNumber) return;

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

      
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [rollNumber]);

  // Return Requests
  const handleReturnRequest = async (issue_id) => {
    try {
      const res = await axios.post(
        "http://localhost/LMS/Api/issue/requestReturn.php",
        { issue_id }
      );

      alert(res.data.message);
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
      alert("Return request failed");
    }
  };

  // Categorize Requests (Optimized)
  const { approved, pending, rejected } = useMemo(() => {
    return {
      approved: requests.filter((r) => r.status === "approved" && r.return_status !== 'return'),
      pending: requests.filter((r) => r.status === "pending"),
      rejected: requests.filter((r) => r.status === "reject"),
    };
  }, [requests]);


  console.log(approved ,"-----------------------");
  // Overdue Calculation
  const getOverdueDays = (due_date) => {
    if (!due_date) return 0;

    const today = new Date();
    const due = new Date(due_date);

    const diff = Math.floor(
      (today - due) / (1000 * 60 * 60 * 24)
    );

    return diff > 0 ? diff : 0;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        My Books
      </h1>

      
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-5">
          Approved Books ({approved.length})
        </h2>

        {approved.length === 0 && <p>No approved books</p>}

        {approved.map((book) => {
          const overdue = getOverdueDays(book.due_date);

          return (
            <div
              key={book.issue_id}
              className="mb-4 max-w-3xl rounded-xl p-[2px] bg-gradient-to-r from-green-200 via-green-100 to-transparent"
            >
              <div className="flex items-center justify-between bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition">
                <div className="flex items-center gap-4">
                  <div className="bg-green-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl">
                    📕
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {book.title}
                    </h3>

                    <p className="text-gray-500">
                      Issue ID: {book.issue_id}
                    </p>

                    <p className="text-gray-400 text-sm">
                      ISBN: {book.isbn}
                    </p>

                    <p className="text-sm mt-2 text-gray-500">
                      Borrowed: {book.issue_date} | Due:{" "}
                      {book.due_date || "N/A"}
                    </p>

                    {overdue > 0 && (
                      <p className="text-red-500 text-sm mt-2">
                        ⚠ Overdue by {overdue} days
                      </p>
                    )}
                  </div>
                </div>

                {/* Return Button */}
                {book.return_status === "not return" && (
                  <button
                    onClick={() =>
                      handleReturnRequest(book.issue_id)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    ⟳ Request Return
                  </button>
                )}

                {book.return_status === "pending" && (
                  <button className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
                    Return Pending
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-5">
          Pending Requests ({pending.length})
        </h2>

        {pending.length === 0 && <p>No pending requests</p>}

        {pending.map((book) => (
          <div
            key={book.issue_id}
            className="mb-4 max-w-3xl rounded-xl p-[2px] bg-gradient-to-r from-yellow-200 via-yellow-100 to-transparent"
          >
            <div className="flex items-center justify-between bg-white rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl">
                  📕
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {book.title}
                  </h3>

                  <p className="text-gray-500">{book.isbn}</p>

                  <p className="text-sm text-gray-400">
                    Requested on {book.issue_date}
                  </p>
                </div>
              </div>

              <span className="text-yellow-600 font-semibold">
                Pending
              </span>
            </div>
          </div>
        ))}
      </div>

      {/*REJECTED*/}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-5">
          Rejected Requests ({rejected.length})
        </h2>

        {rejected.length === 0 && <p>No rejected requests</p>}

        {rejected.map((book) => (
          <div
            key={book.issue_id}
            className="mb-4 max-w-3xl rounded-xl p-[2px] bg-gradient-to-r from-red-200 via-red-100 to-transparent"
          >
            <div className="flex items-center justify-between bg-white rounded-xl p-5 shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-red-500 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl">
                  📕
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {book.title}
                  </h3>

                  <p className="text-gray-500">{book.isbn}</p>

                  <p className="text-sm text-gray-400">
                    Requested on {book.issue_date}
                  </p>
                </div>
              </div>

              <span className="text-red-600 font-semibold">
                Rejected
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewBooks;