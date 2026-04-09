import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";
import axios from "axios";

function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const name = user?.name;
  const rollNumber = user?.roll_number;

  const navigate = useNavigate();

  const [showChat, setShowChat] = useState(false);

  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  const [data, setData] = useState({
    total_books: 0,
    available: 0,
    returned: 0,
    userName: name,
    department: "CSE",
  });

  const [allbook, setAllbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookLoading, setBookLoading] = useState(true);

  // =========================
  // 📊 DASHBOARD API
  // =========================
  useEffect(() => {
    fetch("http://localhost/LMS/Api/auth/dashboard.php")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // =========================
  // 📚 BOOKS API
  // =========================
  useEffect(() => {
    fetch("http://localhost/LMS/Api/books/getBooks.php")
      .then((res) => res.json())
      .then((res) => {
        setAllbook(res);
        setBookLoading(false);
      })
      .catch(() => setBookLoading(false));
  }, []);

  // =========================
  // 🤖 RECOMMENDATION API
  // =========================
  const fetchRecommendations = async () => {
    if (!rollNumber) return;

    setRecLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/recommend", {
        roll_number: rollNumber,
      });

      console.log("🔥 Recommendation API:", res.data);

      setRecommended(res.data.recommendations || []);
    } catch (err) {
      console.error("❌ Recommendation Error:", err);
    }

    setRecLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [rollNumber]);

  if (loading) {
    return <h2 className="p-5 text-lg">Loading Dashboard...</h2>;
  }

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>

        {/* ✅ Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {name} 👋
          </h2>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/books")}
              className="bg-white text-green-700 px-4 py-2 rounded-lg"
            >
              Browse Books →
            </button>

            <button
              onClick={() => navigate("/my-books")}
              className="bg-green-500 px-4 py-2 rounded-lg"
            >
              My Books
            </button>

            <button
              onClick={() => setShowChat(true)}
              className="bg-yellow-400 text-black px-5 py-2 rounded-lg"
            >
              LibAssist
            </button>
          </div>
        </div>

        {/* ✅ Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-600">Total Books</p>
            <h2 className="text-3xl font-bold text-black">
              {data.total_books}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-600">Available</p>
            <h2 className="text-3xl font-bold text-green-600">
              {data.available}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-600">Returned</p>
            <h2 className="text-3xl font-bold text-purple-600">
              {data.returned}
            </h2>
          </div>
        </div>

        {/* ========================= */}
        {/* 🤖 AI RECOMMENDED BOOKS */}
        {/* ========================= */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🎯 Recommended for You
          </h2>

          {recLoading ? (
            <p className="text-gray-500">Loading recommendations...</p>
          ) : recommended.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map((rec) => {
                const book = allbook.find(
                  (b) => String(b.isbn) === String(rec.isbn)
                );

                if (!book) return null;

                return (
                  <div
                    key={rec.isbn}
                    className="cursor-pointer transition hover:scale-105"
                  >
                    <div className="h-40 bg-green-500 rounded-xl flex items-center justify-center text-white">
                      📖
                    </div>

                    <h3 className="mt-2 text-black font-bold">
                      {book.title}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {book.author}
                    </p>

                    <p className="text-xs text-green-600">
                      {/* Score: {rec.score} */}
                      ISBN: {rec.isbn}
                    </p>

                    <p className="text-xs text-gray-400">
                      Based on your activity
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">
              No recommendations yet 😢
            </p>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* 🤖 CHATBOT DRAWER */}
      {/* ========================= */}
      <div
        onClick={() => setShowChat(false)}
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${
          showChat ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      <div
        className={`fixed top-0 right-0 w-[400px] h-full bg-white shadow-xl z-50 flex flex-col p-4
        transform transition-transform duration-500
        ${showChat ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-3 text-black">
          <h2 className="text-lg font-bold">LibAssist</h2>
          <button onClick={() => setShowChat(false)}>❌</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Chatbot />
        </div>
      </div>
    </>
  );
}

export default Home;