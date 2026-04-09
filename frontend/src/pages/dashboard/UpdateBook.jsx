import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateBook, getBooks } from "../../features/book/bookSlice";

function UpdateBook() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isbn } = useParams();

  const { books } = useSelector((state) => state.book);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  //Load book data into form
  useEffect(() => {
    if (books.length === 0) {
      dispatch(getBooks()); // for refresh case
    } else {
      const book = books.find((b) => b.isbn === isbn);

      if (book) {
        reset({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category_id,
          total: book.total,
          available: book.available,
        });
      }
    }
  }, [books, isbn, reset, dispatch]);

  //Submit update
  const onSubmit = (data) => {
    dispatch(
      updateBook({
        isbn,
        bookData: {
          ...data,
          category_id: data.category,
        },
      })
    );

    navigate("/dashboard/books"); // go back
  };

  return (
    <div className="max-w-xl text-black mx-auto p-6 shadow-lg rounded-2xl bg-white">
      <h2 className="text-2xl font-bold mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Author */}
        <input
          type="text"
          placeholder="Author"
          {...register("author", { required: "Author is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.author && <p className="text-red-500">{errors.author.message}</p>}

        {/* ISBN*/}
        <input
          type="text"
          {...register("isbn")}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          {...register("category", { required: "Category is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.category && <p className="text-red-500">{errors.category.message}</p>}

        {/* Total */}
        <input
          type="number"
          placeholder="Total Copies"
          {...register("total", { required: "Total required" })}
          className="w-full border p-2 rounded"
        />

        {/* Available */}
        <input
          type="number"
          placeholder="Available Copies"
          {...register("available", { required: "Available required" })}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Update Book
        </button>
      </form>
    </div>
  );
}

export default UpdateBook;