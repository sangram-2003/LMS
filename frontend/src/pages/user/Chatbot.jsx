
import React, { useState } from "react";
import axios from "axios";
import { RiSendPlaneFill } from "react-icons/ri";
const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [requestLoading, setRequestLoading] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const rollNumber = user?.roll_number;


  //extract isbn
  const extractISBNsFromText = (text) => {
    const matches = text.match(/ISBN[:\s*]*([A-Za-z0-9-]+)/gi);

    const result = matches
      ? matches.map((item) =>
          item.replace(/ISBN[:\s*]*/i, "").trim()
        )
      : [];

    console.log("📌 Extracted ISBN:", result);
    return result;
  };


  // Match ISBN

  const getMatchedISBNs = (answerText, isbnArray) => {
    const extracted = extractISBNsFromText(answerText);

    console.log("🔍 Extracted:", extracted);
    console.log("📦 Backend ISBN:", isbnArray);

    const matched =
      isbnArray?.filter((isbn) => extracted.includes(isbn)) || [];

    console.log("✅ Matched ISBN:", matched);

    return matched;
  };


  // REQUEST BOOK

  const handleAdd = async (book) => {
    if (!rollNumber) {
      alert("User not logged in!");
      return;
    }

    setRequestLoading(book.isbn);

    try {
      const res = await axios.post(
        "http://localhost/LMS/Api/issue/requestBook.php",
        {
          roll_number: rollNumber,
          isbn: book.isbn,
        }
      );

      console.log("📤 Request response:", res.data);

      if (res.data.status === "success") {
        setRequestedBooks((prev) => [...prev, book.isbn]);
      }

      alert(res.data.message);
    } catch (err) {
      console.error("❌ Request failed:", err);
      alert("❌ Request failed");
    }

    setRequestLoading(null);
  };


  //  Fetch books

  const fetchBooks = async (isbnList) => {
    console.log("📡 Fetching books for:", isbnList);

    try {
      const promises = isbnList.map((isbn) =>
        fetch(
          `http://localhost/LMS/Api/books/getBookByIsbn.php?isbn=${isbn}`
        ).then((res) => res.json())
      );

      const results = await Promise.all(promises);

      console.log("📡 Raw API results:", results);

      const books = results
        .filter((r) => r.success)
        .map((r) => ({
          ...r.data,
          available: Number(r.data.available),
        }));

      console.log("📚 Final Books:", books);

      return books;
    } catch (err) {
      console.log("❌ Fetch error", err);
      return [];
    }
  };


  // SEND QUERY

  const sendQuery = async () => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: query }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      console.log("🧠 API RESPONSE:", data);

      const matchedISBN = getMatchedISBNs(data.answer, data.isbn);

      const cleanAnswer = (data.answer || "").replace(
        /ISBN[:\s*]*[A-Za-z0-9-]+/gi,
        ""
      );

      const books = await fetchBooks(matchedISBN);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: cleanAnswer,
          books: books,
        },
      ]);
    } catch (err) {
      console.error("❌ API Error:", err);

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Error connecting to server" },
      ]);
    }

    setQuery("");
    setLoading(false);
  };


  return (
    <div className="flex flex-col h-full  ">
      <div className="flex-1 p-4  space-y-3 bg-white overflow-y-auto ">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">
           ASK SOME THINGS ABOUT BOOK
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded max-w-[70%] ${
              msg.type === "user"
                ? "bg-green-500 text-white ml-auto"
                : "bg-gray-100 text-black"
            }`}
          >
            {/* 💬 TEXT */}
            <p className="whitespace-pre-line">{msg.text}</p>

            {/* 📚 BOOKS */}
            {msg.books && msg.books.length > 0 ? (
              <div className="mt-3 space-y-2">
                {msg.books.map((book) => (
                  <div
                    key={book.isbn}
                    className="border p-3 rounded shadow bg-white"
                  >
                    <p className="font-bold">{book.title}</p>
                    <p className="text-sm">👤 {book.author}</p>
                    <p className="text-xs text-gray-500">
                      ISBN: {book.isbn}
                    </p>
                    <p className="text-xs">
                      📦 Available: {book.available}
                    </p>

                    <button
                      onClick={() => handleAdd(book)}
                      disabled={
                        book.available <= 0 ||
                        requestedBooks.includes(book.isbn) ||
                        requestLoading === book.isbn
                      }
                      className={`mt-2 px-3 py-1 rounded text-white ${
                        book.available > 0 &&
                        !requestedBooks.includes(book.isbn)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400"
                      }`}
                    >
                      {requestLoading === book.isbn
                        ? "⏳ Sending..."
                        : requestedBooks.includes(book.isbn)
                        ? "✅ Requested"
                        : "Request Book"}
                    </button>
                  </div>
                ))}
              </div>
            ) : msg.type === "bot" ? (
              <p className="text-sm  text-gray-500 mt-2">
                ⚠️ No books found
              </p>
            ) : null}
          </div>
        ))}

        {loading && <p className="text-black">⏳ Thinking...</p>}
      </div>

      {/* INPUT */}
      <div className="flex gap-2 p-1  bg-gray-600/30 rounded-4xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-black border outline-none border-none focus:border-none p-3 rounded-3xl"
          placeholder="Ask about books..."
          onKeyDown={(e) => e.key === "Enter" && sendQuery()}
        />
        <button
          onClick={sendQuery}
          className="bg-green-600/50 text-black flex justify-center items-center text-2xl px-3 mr-1 rounded-4xl"
        >
          <RiSendPlaneFill className="mt-1 text-green-1000 "/>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;













// import React, { useState } from "react";
// import axios from "axios"; // ✅ FIX

// const Chatbot = () => {
//   const [query, setQuery] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [requestedBooks, setRequestedBooks] = useState([]);
//   const [requestLoading, setRequestLoading] = useState(null); // ✅ per book loader

//   const user = JSON.parse(localStorage.getItem("user"));
//   const rollNumber = user?.roll_number;

//   // =========================
//   // 🔍 Extract ISBN
//   // =========================
//   const extractISBNsFromText = (text) => {
//     const matches = text.match(/ISBN:\s*([A-Za-z0-9-]+)/g);
//     return matches
//       ? matches.map((item) => item.split(":")[1].trim())
//       : [];
//   };

//   const getMatchedISBNs = (answerText, isbnArray) => {
//     const extracted = extractISBNsFromText(answerText);
//     return isbnArray.filter((isbn) => extracted.includes(isbn));
//   };

//   // =========================
//   // 📥 REQUEST BOOK
//   // =========================
//   const handleAdd = async (book) => {
//     if (!rollNumber) {
//       alert("User not logged in!");
//       return;
//     }

//     setRequestLoading(book.isbn); // 🔥 start loader

//     try {
//       const res = await axios.post(
//         "http://localhost/LMS/Api/issue/requestBook.php",
//         {
//           roll_number: rollNumber,
//           isbn: book.isbn,
//         }
//       );

//       if (res.data.status === "success") {
//         setRequestedBooks((prev) => [...prev, book.isbn]);
//       }

//       alert(res.data.message);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Request failed");
//     }

//     setRequestLoading(null); // 🔥 stop loader
//   };

//   // =========================
//   // 📚 Fetch books
//   // =========================
//   const fetchBooks = async (isbnList) => {
//     try {
//       const promises = isbnList.map((isbn) =>
//         fetch(
//           `http://localhost/LMS/Api/books/getBookByIsbn.php?isbn=${isbn}`
//         ).then((res) => res.json())
//       );

//       const results = await Promise.all(promises);
//       console.log(results ,"ddddd")
//       return results
//         .filter((r) => r.success)
//         .map((r) => ({
//           ...r.data,
//           available: Number(r.data.available), // ✅ FIX
//         }));
//     } catch (err) {
//       console.log("❌ Fetch error", err);
//       return [];
//     }
//   };

//   console.log(fetchBooks)
//   // =========================
//   // 📤 SEND QUERY
//   // =========================
//   const sendQuery = async () => {
//     if (!query.trim()) return;

//     setMessages((prev) => [...prev, { type: "user", text: query }]);
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:8000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query }),
//       });

//       const data = await res.json();

//       const matchedISBN = getMatchedISBNs(data.answer, data.isbn);

//       const cleanAnswer = (data.answer || "").replace(
//         /ISBN:\s*[A-Za-z0-9-]+/g,
//         ""
//       );

//       const books = await fetchBooks(matchedISBN);

//       setMessages((prev) => [
//         ...prev,
//         {
//           type: "bot",
//           text: cleanAnswer,
//           books,
//         },
//       ]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "❌ Error connecting to server" },
//       ]);
//     }

//     setQuery("");
//     setLoading(false);
//   };

//   // =========================
//   // 🎨 UI
//   // =========================
//   return (
//     <div className="flex flex-col h-screen">
//       <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-3 rounded max-w-[70%] ${
//               msg.type === "user"
//                 ? "bg-green-500 text-white ml-auto"
//                 : "bg-gray-100 text-black"
//             }`}
//           >
//             <p className="whitespace-pre-line">{msg.text}</p>

//             {/* 📚 BOOKS */}
//             {msg.books?.length > 0 && (
//               <div className="mt-3 space-y-2">
//                 {msg.books.map((book) => (
//                   <div
//                     key={book.isbn}
//                     className="border p-3 rounded shadow bg-white"
//                   >
//                     <p className="font-bold">{book.title}</p>
//                     <p className="text-sm">👤 {book.author}</p>
//                     <p className="text-xs text-gray-500">
//                       ISBN: {book.isbn}
//                     </p>
//                     <p className="text-xs">
//                       📦 Available: {book.available}
//                     </p>

//                     <button
//                       onClick={() => handleAdd(book)}
//                       disabled={
//                         book.available <= 0 ||
//                         requestedBooks.includes(book.isbn) ||
//                         requestLoading === book.isbn
//                       }
//                       className={`mt-2 px-3 py-1 rounded text-white ${
//                         book.available > 0 &&
//                         !requestedBooks.includes(book.isbn)
//                           ? "bg-blue-600 hover:bg-blue-700"
//                           : "bg-gray-400"
//                       }`}
//                     >
//                       {requestLoading === book.isbn
//                         ? "⏳ Sending..."
//                         : requestedBooks.includes(book.isbn)
//                         ? "✅ Requested"
//                         : "Request Book"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}

//         {loading && <p>⏳ Thinking...</p>}
//       </div>

//       {/* INPUT */}
//       <div className="flex gap-2 p-3 bg-gray-100">
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="flex-1 text-black border p-3 rounded"
//           placeholder="Ask about books..."
//           onKeyDown={(e) => e.key === "Enter" && sendQuery()}
//         />
//         <button
//           onClick={sendQuery}
//           className="bg-green-600 text-white px-6 rounded"
//         >
//           Ask
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;