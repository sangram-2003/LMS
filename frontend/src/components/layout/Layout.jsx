import React from "react";
import { Outlet } from "react-router-dom";

function Layout({children}) {
  return (
    <div className="flex md:flex-1 flex-row">

      
      <div className=" w-full md:w-64 h-20 md:h-screen bg-white shadow-lg shadow-gray-500/50 text-white  fixed left-0 top-0">
        {/* Sidebar */}
{children}
      </div>

      {/* Main Content */}
      <div className="md:ml-64 mt-20 flex-1 md:p-4 bg-stone-50 min-h-screen overflow-y-auto">
        
        <div className="w-full  text-white ">
          <Outlet/>
        </div>

        

      </div>

    </div>
  );
}

export default Layout;