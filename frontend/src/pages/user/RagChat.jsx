import React, { useState } from "react";

const RagChat = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("❌ Error connecting to RAG API");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        📚 AI Book Assistant
      </h1>

      {/* Search Box */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow-md flex gap-3">
        <input
          type="text"
          placeholder="Ask for books (e.g. machine learning)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 text-black border rounded-lg outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-4 text-gray-600">⏳ Searching...</p>
      )}

      {/* Answer */}
      {answer && (
        <div className="mt-6 w-full max-w-2xl bg-white p-5 rounded-xl shadow-md">
          <h2 className="font-semibold text-lg mb-2 text-green-600">
            📖 Recommendation
          </h2>
          <pre className="whitespace-pre-wrap text-gray-800">
            {answer}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RagChat;