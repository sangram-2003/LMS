import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addBook } from "../../features/book/bookSlice";

const AddBook = () => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = ({
    author,
    available,
    category,
    isbn,
    title,
    total,
  }) => {

    dispatch(
      addBook({
        isbn,
        title,
        author,
        category_id: category,
        total,
        available,
      })
    ).then((res) => {

      // ✅ Check success properly
      if (res.meta.requestStatus === "fulfilled") {
        setType("success");
        setMessage("Book added successfully ✅");
        reset();
      } else {
        setType("error");
        setMessage("Failed to add book ❌");
      }

      setTimeout(() => {
        setMessage("");
      }, 3000);
    });
  };

  return (
    <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100 relative">

      {/* ✅ Popup */}
      {message && (
        <div
          className={`absolute top-6 px-6 py-3 rounded shadow-lg text-white ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {/* ✅ Centered Card */}
      <div className="max-w-xl w-full text-black p-6 shadow-lg rounded-2xl bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Book</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <input
              type="text"
              placeholder="Author"
              {...register("author", { required: "Author is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.author && (
              <p className="text-red-500">{errors.author.message}</p>
            )}
          </div>

          {/* ISBN */}
          <div>
            <input
              type="text"
              placeholder="ISBN"
              {...register("isbn", { required: "ISBN is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.isbn && (
              <p className="text-red-500">{errors.isbn.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <input
              type="text"
              placeholder="Category"
              {...register("category", { required: "Category is required" })}
              className="w-full border p-2 rounded"
            />
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Total Copies */}
          <div>
            <input
              type="number"
              placeholder="Total Copies"
              {...register("total", {
                required: "Total copies required",
                min: { value: 1, message: "Must be at least 1" }
              })}
              className="w-full border p-2 rounded"
            />
            {errors.total && (
              <p className="text-red-500">{errors.total.message}</p>
            )}
          </div>

          {/* Available Copies */}
          <div>
            <input
              type="number"
              placeholder="Available Copies"
              {...register("available", {
                required: "Available copies required",
                min: { value: 0, message: "Cannot be negative" }
              })}
              className="w-full border p-2 rounded"
            />
            {errors.available && (
              <p className="text-red-500">{errors.available.message}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Add Book
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddBook;