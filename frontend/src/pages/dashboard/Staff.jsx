import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStaff } from "../../features/auth/staffSlice"
import Search from "../../components/ui/search";
import Button from "../../components/ui/Button";
import { FaPlus } from "react-icons/fa6";

function Staff() {
  const dispatch = useDispatch();
  const [searchItem, setSearchItem] = useState("");

  const {staffList , loading} = useSelector((state) => state.staff);

  // Fetch staff data
  useEffect(() => {
    dispatch(getAllStaff());
  }, [dispatch]);



  
  const filteredStaff = staffList.filter((item) =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-700">
       <main className="flex-1 p-6 md:p-10">
        
        {/* Header */}
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Manage Staff
          </h2>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Search */}
            <Search
              placeholder="Search staff..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />

            {/* Add Staff */}
            <div className="flex gap-4 justify-center items-center">
              <Button
                title="Add Staff"
                icon={<FaPlus />}
                link="/dashboard/add-staff"
              />
            </div>
          </div>
        </header>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Head */}
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4">{item.email}</td>
                    <td className="p-4">{item.phone}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
                        {item.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6 text-gray-400"
                  >
                    No staff found 😢
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center mt-4 text-gray-500">Loading...</p>
        )}
      </main>
    </div>
  );
}

export default Staff;