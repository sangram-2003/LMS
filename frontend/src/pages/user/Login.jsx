import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { loginStaff } from "../../features/auth/staffSlice";
import { Navigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();

  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);
  const { user: staffUser } = useSelector((state) => state.staff);

  const [loginType, setLoginType] = useState("student");

  // ✅ TEXT CAPTCHA STATE
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ GENERATE TEXT CAPTCHA
  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let newCaptcha = "";

    for (let i = 0; i < 5; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCaptcha(newCaptcha);
  };

  // LOAD CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  // SUBMIT
  const onSubmit = (data) => {
    if (userCaptcha !== captcha) {
      setCaptchaError("Captcha is incorrect");
      generateCaptcha();
      return;
    }

    setCaptchaError("");

    if (loginType === "student") {
      dispatch(
        loginUser({
          roll_number: data.username,
          password: data.password,
        })
      );
    } else {
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

        {/* Toggle */}
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
            
            {/* Username / Phone */}
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

            
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Verification
              </label>

              <div className="flex items-center justify-between bg-gradient-to-r rounded-lg px-4 py-3 shadow-sm">
                
               
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-gray-300 to-gray-100 px-5 py-2 rounded-md text-xl font-bold tracking-widest text-black select-none">
                    {captcha}
                  </div>

                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="px-3 py-1 bg-white border rounded-md shadow hover:bg-gray-100 transition"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Enter Captcha"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                className="mt-3 w-full border border-gray-300 rounded-lg p-3 text-black shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              />

              {/* Error */}
              {captchaError && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  {captchaError}
                </p>
              )}
            </div>

            {/* Submit */}
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