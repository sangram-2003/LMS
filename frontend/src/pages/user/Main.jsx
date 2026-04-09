import React from "react";
import { Link } from "react-router-dom";

const Main = () => {
   const arr = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Login",
    link: "/login",
  },
  
];
  return (
    <>
      {/* Header */}
      <header className="text-center bg-[#002b5b] py-5 border-b-[5px] border-[#d84b37]">
        <a
          href="#"
          className="flex flex-col sm:flex-row items-center justify-center no-underline"
        >
          <img
            src="https://rkmgec.ac.in/images/essentials/logo.png"
            alt="RKMGEC Logo"
            className="h-[80px] sm:h-[90px] mb-3 sm:mb-0 sm:mr-5"
          />
          <h3 className="text-center sm:text-left">
            <span className="block text-white text-lg sm:text-[22px] font-bold">
              RAMKRISHNA MAHATO GOVERNMENT ENGINEERING COLLEGE
            </span>
            <span className="block text-[#fffea3] text-sm sm:text-[16px] my-1">
              LIBRARY MANAGEMENT SYSTEM
            </span>
            <span className="block text-[#ddd] text-xs sm:text-[13px]">
              Vill: Agharpur, P.O.-Ramamoti, Purulia 723103.
            </span>
          </h3>
        </a>
      </header>

      {/* Tagline */}
      <div className="text-sm text-white p-2 bg-[#d84b37] text-center tracking-wide">
        Connecting Students with Knowledge
      </div>
       
      {/* Navbar */}
     <nav className="bg-[#001f42] flex flex-wrap justify-center gap-2 py-2">
  {arr.map((item, index) => (
    <Link
      key={index}
      to={item.link}
      className="text-white px-4 py-2 text-sm sm:text-base font-medium transition duration-300 hover:bg-[#d84b37] rounded-md"
    >
      {item.title}
    </Link>
  ))}
</nav>

      
      <section
        className="text-center text-white py-16 sm:py-20 px-5 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,43,91,0.8), rgba(0,43,91,0.8)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <h1 className="text-2xl sm:text-4xl mb-5">
          Welcome to the Digital Gateway
        </h1>

        <p className="mb-6 sm:mb-8 text-sm sm:text-base">
          Access thousands of engineering resources and journals in one click.
        </p>

        <div className="max-w-[600px] mx-auto flex flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Search by Book Title, Author or ISBN..."
            className="flex-1 p-3 sm:p-4 text-sm sm:text-base rounded-md sm:rounded-r-none outline-none text-black bg-white/80 backdrop-blur-sm 
            placeholder-gray-500 border border-gray-300"
          />
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#d84b37] text-white font-bold rounded-md sm:rounded-l-none mt-2 sm:mt-0">
            SEARCH
          </button>
        </div>
      </section>

      Stats
      <div className="max-w-[1000px] mx-auto px-5 py-8 bg-white -mt-10 rounded-lg shadow-md flex flex-col sm:flex-row justify-around text-center gap-6">
        <div>
          <h2 className="text-[#002b5b] text-2xl sm:text-[28px]">25,000+</h2>
          <p className="text-[#666] text-sm">Books Available</p>
        </div>

        <div>
          <h2 className="text-[#002b5b] text-2xl sm:text-[28px]">1,200+</h2>
          <p className="text-[#666] text-sm">Active Students</p>
        </div>

        <div>
          <h2 className="text-[#002b5b] text-2xl sm:text-[28px]">500+</h2>
          <p className="text-[#666] text-sm">E-Journals</p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-[1200px] mx-auto my-12 px-5">
        <h2 className="text-center mb-10 text-[#002b5b] text-lg sm:text-xl font-semibold">
          Explore Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Computer Science",
              desc: "Data Structures, Algorithms, Architecture",
            },
            {
              title: "Mechanical Eng.",
              desc: "Thermodynamics, Fluid Mechanics, CAD",
            },
            {
              title: "Electrical Eng.",
              desc: "Circuit Theory, Power Systems, Control",
            },
            {
              title: "Humanities",
              desc: "Bengali Literature, Ethics, Values",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 text-center rounded-lg border-b-[4px] border-[#002b5b] transition duration-300 cursor-pointer hover:-translate-y-2 hover:border-[#d84b37] hover:shadow-lg"
            >
              <h4 className="mb-2 text-[#002b5b] font-semibold">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#002b5b] text-white text-center py-5 mt-10">
        <p className="text-sm">
          &copy; 2026 RKMGEC Library System. All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default Main;