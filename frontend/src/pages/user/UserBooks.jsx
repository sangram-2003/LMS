import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";

// =========================
// 🔥 COMMON ACTIVITY FUNCTION
// =========================
const trackActivity = async ({
  rollNumber = null,
  isbn = null,
  actionType,
  searchTerm = null,
}) => {
  try {
    await axios.post("http://localhost/LMS/Api/activity/addActivity.php", {
      roll_number: rollNumber,
      isbn: isbn,
      action_type: actionType,
      search_term: searchTerm,
    });
  } catch (err) {
    console.error("Activity Tracking Error:", err);
  }
};

// =========================
// 🔥 CUSTOM HOVER HOOK
// =========================
const useHoverView = (isbn, viewedBooksRef, options = {}) => {
  const { minTime = 2000, maxTime = 10000, onValidView } = options;

  const hoverStart = useRef(null);
  const timer = useRef(null);
  const counted = useRef(false);

  const handleMouseEnter = () => {
    hoverStart.current = Date.now();
    counted.current = false;

    timer.current = setTimeout(() => {
      const duration = Date.now() - hoverStart.current;

      if (duration >= minTime && duration <= maxTime) {
        if (!viewedBooksRef.current[isbn]) {
          viewedBooksRef.current[isbn] = 0;
        }

        if (!counted.current) {
          viewedBooksRef.current[isbn] += 1;
          counted.current = true;

          console.log(
            `👀 VIEW: ${isbn} | Count: ${viewedBooksRef.current[isbn]}`
          );

          if (onValidView) {
            onValidView(isbn, viewedBooksRef.current[isbn]);
          }
        }
      }
    }, minTime);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer.current);

    const duration = Date.now() - hoverStart.current;

    if (duration > maxTime) {
      console.log(`⛔ Ignored (too long): ${isbn}`);
    }
  };

  return { handleMouseEnter, handleMouseLeave };
};

// =========================
// 📚 BOOK CARD COMPONENT
// =========================
const BookCard = ({
  book,
  categoryMap,
  handleAdd,
  requestedBooks,
  viewedBooksRef,
  rollNumber,
}) => {
  const { handleMouseEnter, handleMouseLeave } = useHoverView(
    book.isbn,
    viewedBooksRef,
    {
      onValidView: (isbn, count) => {
        // 🔥 Track VIEW
        trackActivity({
          rollNumber,
          isbn,
          actionType: "view",
        });
      },
    }
  );

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
    >
      <h3 className="font-bold text-lg">{book.title}</h3>
      <p className="text-gray-500">{book.author}</p>

      <p className="text-sm text-gray-400">
        {categoryMap[String(book.category_id)] || "Unknown"}
      </p>

      <p className="text-sm mt-2">ISBN: {book.isbn}</p>

      <p
        className={`mt-2 font-bold ${
          book.available > 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {book.available} Available
      </p>

      <button
        onClick={() => handleAdd(book)}
        disabled={
          book.available <= 0 || requestedBooks.includes(book.isbn)
        }
        className={`mt-3 px-4 py-2 rounded-md text-white ${
          book.available > 0 &&
          !requestedBooks.includes(book.isbn)
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {requestedBooks.includes(book.isbn)
          ? "⏳ Requested"
          : "Request Book"}
      </button>
    </div>
  );
};

// =========================
// 🚀 MAIN COMPONENT
// =========================
const UserBooks = () => {
  const viewedBooksRef = useRef({}); // ✅ FIXED

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [requestedBooks, setRequestedBooks] = useState([]);

  // ✅ Safe user parsing
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  }, []);

  const rollNumber = user?.roll_number;

  // =========================
  // FETCH DATA
  // =========================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost/LMS/Api/categories/get.php"
      );
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(
        "http://localhost/LMS/Api/books/getBooks.php"
      );
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // =========================
  // 🔍 SEARCH TRACKING
  // =========================
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const delay = setTimeout(() => {
      trackActivity({
        rollNumber,
        actionType: "search",
        searchTerm,
      });
    }, 600);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // =========================
  // CATEGORY MAP
  // =========================
  const categoryMap = useMemo(() => {
    return Object.fromEntries(
      categories.map((c) => [
        String(c.category_id),
        c.category_name,
      ])
    );
  }, [categories]);

  // =========================
  // 📥 REQUEST BOOK
  // =========================
  const handleAdd = async (book) => {
    if (!rollNumber) {
      alert("User not logged in!");
      return;
    }

    try {
      await axios.post(
        "http://localhost/LMS/Api/issue/requestBook.php",
        {
          roll_number: rollNumber,
          isbn: book.isbn,
        }
      );

      // 🔥 Track REQUEST
      trackActivity({
        rollNumber,
        isbn: book.isbn,
        actionType: "request",
      });

      setRequestedBooks((prev) => [...prev, book.isbn]);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // FILTER BOOKS
  // =========================
  const filteredBooks = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return books.filter((book) => {
      const matchesSearch =
        (book.title?.toLowerCase() || "").includes(search) ||
        (book.author?.toLowerCase() || "").includes(search) ||
        (book.isbn?.toLowerCase() || "").includes(search);

      const matchesCategory =
        activeCategory === "All" ||
        String(book.category_id) === String(activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, activeCategory]);

  // =========================
  // RENDER
  // =========================
  return (
    <div className="flex min-h-screen bg-gray-100 text-slate-700">
      <main className="flex-1 p-6 md:p-10">
        <h2 className="text-3xl font-extrabold mb-8">
          Browse Books
        </h2>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border rounded-xl mb-6 w-full max-w-md"
        />

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.isbn}
              book={book}
              categoryMap={categoryMap}
              handleAdd={handleAdd}
              requestedBooks={requestedBooks}
              viewedBooksRef={viewedBooksRef}
              rollNumber={rollNumber}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserBooks;