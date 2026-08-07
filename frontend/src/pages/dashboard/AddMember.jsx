import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";

function AddMember() {
  const dispatch = useDispatch();

  const [message, setMessage] = useState(""); // ✅ popup message
  const [type, setType] = useState(""); // success / error

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    dispatch(
      registerUser({
        name: data.name,
        email: data.email,
        roll_number: data.roll_number,
        department: data.department,
        phone: data.phone_number,
        date_of_birth: data.dob,
      })
    )
      .unwrap()
      .then(() => {
        setType("success");
        setMessage("Student added successfully");
        reset();
      })
      .catch(() => {
        setType("error");
        setMessage("Failed to add student ❌");
      });

    // auto hide popup after 3 sec
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center relative">

        {/* ✅ POPUP */}
        {message && (
          <div
            className={`absolute top-10 px-6 py-3 rounded shadow-lg text-white ${
              type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <div className="max-w-xl w-4/6 text-black mx-auto p-6 shadow-lg rounded-2xl bg-white">
          <h2 className="text-2xl font-bold mb-4">Add Students</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Roll */}
            <div>
              <input
                type="number"
                placeholder="Roll number"
                {...register("roll_number", {
                  required: "Roll number is required"
                })}
                className="w-full border p-2 rounded"
              />
              {errors.roll_number && (
                <p className="text-red-500">{errors.roll_number.message}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Name"
                {...register("name", {
                  required: "Name is required"
                })}
                className="w-full border p-2 rounded"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required"
                })}
                className="w-full border p-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <input
                type="date"
                {...register("dob", {
                  required: "DOB is required"
                })}
                className="w-full border p-2 rounded"
              />
              {errors.dob && (
                <p className="text-red-500">{errors.dob.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="number"
                placeholder="Phone number"
                {...register("phone_number", {
                  required: "Phone number is required"
                })}
                className="w-full border p-2 rounded"
              />
              {errors.phone_number && (
                <p className="text-red-500">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <input
                type="text"
                placeholder="Department"
                {...register("department", {
                  required: "Department is required"
                })}
                className="w-full border p-2 rounded"
              />
              {errors.department && (
                <p className="text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Add Member
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default AddMember;