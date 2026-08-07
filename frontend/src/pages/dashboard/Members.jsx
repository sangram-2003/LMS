import React, { useEffect, useState } from "react";
import Search from "../../components/ui/search";
import Button from "../../components/ui/Button";
import { FaPlus } from "react-icons/fa6";
import StudentCard01 from "../../components/ui/StudentCard01";
import { useDispatch, useSelector } from "react-redux";
import { getRequests } from "../../features/issue/issueSlice";
import { getUsers } from "../../features/auth/authSlice";
import { getBooks } from "../../features/book/bookSlice";

function Members() {
  const dispatch = useDispatch();
  const [searchItem, setSearchItem] = useState("");

  const { requests } = useSelector((state) => state.issue);
  const { users } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.book);

  
  useEffect(() => {
    dispatch(getRequests({ role: "admin" }));
    dispatch(getUsers());
    dispatch(getBooks());
  }, [dispatch]);

  // 🔗 Merge requests with student & book info and compute status
  const mergedData = requests.map((item) => {
    const student = users.find((u) => u.roll_number == item.student_roll_number);
    const book = books.find((b) => b.isbn == item.isbn);

    const dueDate = new Date(item.due_date + "T00:00:00");
    const today = new Date();

    let finalStatus = item.status;
    if (item.status === "approved" && item.return_status !== "returned" && dueDate < today) {
      finalStatus = "overdue";
    }

    return {
      ...item,
      studentInfo: student || {},
      bookTitle: book?.title || "Unknown",
      bookAuthor: book?.author || "Unknown",
      finalStatus,
    };
  });

  // Requests per student and calculate totals
 const studentsSummary = users.map((student) => {
  const studentRequests = mergedData.filter(
    (r) => r.student_roll_number === student.roll_number
  );

  const totalRequests = studentRequests.length;
  const totalPending = studentRequests.filter(r => r.finalStatus === "pending").length;
  const totalApproved = studentRequests.filter(r => r.finalStatus === "approved").length;
  const totalReturned = studentRequests.filter(r => r.finalStatus === "returned").length;
  const totalOverdue = studentRequests.filter(r => r.finalStatus === "overdue").length;

  //  Active books: pending + approved
  const totalActive = studentRequests.filter(r =>
    r.finalStatus === "approved" || r.finalStatus === "pending"
  ).length;

  // Current active book
  const currentBook = studentRequests
    .filter(r => r.finalStatus === "approved" || r.finalStatus === "pending")
    .sort((a,b) => new Date(b.issue_date) - new Date(a.issue_date))[0]?.bookTitle || "—";

  return {
    id: student.roll_number,
    name: student.name,
    email: student.email,
    department: student.department,
    joinDate: student.joinDate.split(" ")[0] || "—",
    stats: {
      total: totalRequests,
      pending: totalPending,
      approved: totalApproved,
      returned: totalReturned,
      overdue: totalOverdue,
      active: totalActive, // 🔹 here it is
    },
    currentBook,
    requests: studentRequests,
  };
});

  // Filter students by search
  const filteredStudent = studentsSummary.filter((student) =>
    student.name.toLowerCase().includes(searchItem.toLowerCase())
  );
console.log(filteredStudent)
  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-700">
      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Manage Students
          </h2>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search */}
            <Search
              placeholder="Search students..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />

            {/* Add Students Button */}
            <div className="flex gap-4 justify-center items-center">
              <Button
                title="Add Students"
                icon={<FaPlus />}
                link="/dashboard/add-member"
              />
            </div>
          </div>
        </header>

        {/* Student Cards */}
        {filteredStudent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredStudent.map((student) => (
              <StudentCard01
                key={student.id}
                name={student.name}
                email={student.email}
                department={student.department}
                joinDate={student.joinDate}
                stats={student.stats}
                currentBook={student.currentBook}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">
            No students found 😢
          </p>
        )}
      </main>
    </div>
  );
}

export default Members;
