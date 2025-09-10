import React, { useState } from "react";
import { FaSearch, FaBars, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";



const Header: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  // state
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-[80vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/bg-house.jpg')" }}>
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-black bg-opacity-60 text-white">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <img src="/images/airbnb-logo.png" alt="Airbnb" className="h-8" />
        </div>

        {/* Menu */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="border-b-2 border-white pb-1">Nơi ở</a>
          <a href="#">Trải nghiệm</a>
          <a href="#">Trải nghiệm trực tuyến</a>
        </nav>

        {/* Right buttons */}
        <div className="flex items-center space-x-4">
         <Link
          to="/auth/register"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Đăng ký
        </Link>
          <button onClick={() => setShowLogin(true)} className="px-3 py-1 bg-red-500 rounded-full hover:bg-red-600">
            Login
          </button>
          <a href="#">Đón tiếp khách</a>
          <FaGlobe className="cursor-pointer" />
          <div className="flex items-center border p-2 rounded-full space-x-2 cursor-pointer">
            <FaBars />
            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Search Box */}
      <div className="absolute left-1/2 top-28 transform -translate-x-1/2 w-full max-w-4xl bg-white rounded-full shadow-lg flex items-center px-6 py-3">
        <div className="flex flex-1 space-x-8">
          <div>
            <p className="text-xs font-bold">Địa điểm</p>
            <input placeholder="Bạn sắp đi đâu?" className="outline-none w-full text-sm" />
          </div>
          <div>
            <p className="text-xs font-bold">Nhận phòng</p>
            <span className="text-sm text-gray-400">Thêm ngày</span>
          </div>
          <div>
            <p className="text-xs font-bold">Trả phòng</p>
            <span className="text-sm text-gray-400">Thêm ngày</span>
          </div>
          <div>
            <p className="text-xs font-bold">Khách</p>
            <span className="text-sm text-gray-400">Thêm khách</span>
          </div>
        </div>

        {/* Search Icon */}
        <button className="bg-red-500 text-white p-3 rounded-full">
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default Header;
