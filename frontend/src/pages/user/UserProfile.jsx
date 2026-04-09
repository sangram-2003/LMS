import axios from "axios";
import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [data, setData] = useState(null);
   const user = JSON.parse(localStorage.getItem("user"));
 console.log("user roll number ", user)
  const rollNumber = user?.roll_number;


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
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
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

        {/* INFO GRID */}
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">College</p>
            <p className="font-semibold"> Ramkrishna Mahato Government Engineering College</p>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4">
          <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Change Password
          </button>

         
        </div>
      </div>
    </div>
  );
};

export default UserProfile;