import axios from "axios";
import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [data, setData] = useState(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const rollNumber = user?.roll_number;
  console.log(rollNumber,oldPassword,newPassword)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost/LMS/Api/students/getStudents.php?roll_number=${rollNumber}`
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [rollNumber]);
const handleChangePassword = async () => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost/LMS/Api/students/changepassword.php",
      {
        user_id: rollNumber,
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log(res.data); 
  

    alert(res.data.message);

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);

  } catch (err) {
    console.error(err);
    alert("Error changing password");
  }
};
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 flex justify-center mt-10 md:mt-0 md:items-center">
      
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">

        {/* HEADER */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold">
            {data.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {data.name}
            </h2>
            <p className="text-gray-500">{data.department}</p>
          </div>
        </div>

        {/* INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-semibold">{data.roll_number}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{data.email}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold">{data.phone}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-semibold">{data.date_of_birth}</p>
          </div>

        </div>

        {/* BUTTON */}
        <div className="mt-8">
          <button
            onClick={() => setShowPasswordForm(true)}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Change Password
          </button>
        </div>

      </div>

      
      <div
        className={`fixed inset-0 flex justify-center items-center backdrop-blur-sm transition-all duration-300 ${
          showPasswordForm
            ? "bg-black/20 opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        <div
          className={`bg-white p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 ${
            showPasswordForm
              ? "scale-100 opacity-100"
              : "scale-90 opacity-0"
          }`}
        >

          <h3 className="text-xl font-bold mb-4 text-black">
            Change Password
          </h3>

          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full mb-3 p-2 border rounded text-black"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-3 p-2 border rounded text-black"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded text-black"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowPasswordForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default UserProfile;