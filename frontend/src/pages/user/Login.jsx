import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice"; // student login
import { loginStaff } from "../../features/auth/staffSlice"; // admin login
import { Navigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();

  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);
  const { user: staffUser } = useSelector((state) => state.staff);

  const [loginType, setLoginType] = useState("student"); // 🔥 default

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (loginType === "student") {
      //Student login API
      dispatch(
        loginUser({
          roll_number: data.username,
          password: data.password,
        })
      );
    } else {
      //Admin/Staff login API
      dispatch(
        loginStaff({
          phone: data.phone,
          password: data.password,
        })
      );
    }
  };

  
  if (isLoggedIn) return <Navigate to="/home" />;
  if (staffUser) return <Navigate to="/dashboard" />;

  return (
    <div className="bg-blue-200 p-1 min-h-screen flex items-center">
      <div className="w-full">
        <h2 className="text-center text-blue-500 font-bold text-2xl uppercase mb-6">
          Login
        </h2>

        
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setLoginType("student")}
            className={`px-6 py-2 rounded ${
              loginType === "student"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Student Login
          </button>

          <button
            onClick={() => setLoginType("admin")}
            className={`px-6 py-2 rounded ${
              loginType === "admin"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Admin Login
          </button>
        </div>

        <div className="bg-white p-10 rounded-lg shadow md:w-3/4 mx-auto lg:w-1/2">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            
            {loginType === "student" ? (
              <div className="mb-5">
                <label className="block mb-2 font-bold text-gray-600">
                  Roll Number
                </label>
                <input
                  type="text"
                  placeholder="Enter roll number"
                  {...register("username", {
                    required: "Roll number is required",
                  })}
                  className="border text-black border-gray-300 shadow p-3 w-full rounded"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-5">
                <label className="block mb-2 font-bold text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  {...register("phone", {
                    required: "Phone is required",
                  })}
                  className="border text-black border-gray-300 shadow p-3 w-full rounded"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="mb-5">
              <label className="block mb-2 font-bold text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="border text-black border-gray-300 shadow p-3 w-full rounded"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/*Submit */}
            <button className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold p-4 rounded-lg">
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;