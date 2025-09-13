// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaBars, FaGlobe, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
interface User {
  name: string;
  avatar: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    // Giả sử user được lưu trong localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-rose-50 via-pink-50 to-red-100">
      {/* Hero Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-house.jpg')",
          filter: 'brightness(0.85) saturate(1.1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo Section */}
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                airbnb
              </span>
            </div>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a
                href="#"
                className="relative text-gray-800 font-medium hover:text-rose-600 transition-colors group"
              >
                Nơi ở
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-rose-600 transform scale-x-100 transition-transform"></span>
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-rose-600 font-medium transition-colors"
              >
                Trải nghiệm
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-rose-600 font-medium transition-colors"
              >
                Trải nghiệm trực tuyến
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Host your home */}
              <button className="hidden md:block text-sm font-medium text-gray-700 hover:text-rose-600 px-3 py-2 rounded-full hover:bg-gray-50 transition-all">
                Cho thuê chỗ ở của bạn
              </button>

              {/* Language */}
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FaGlobe className="w-4 h-4 text-gray-700" />
              </button>

              {/* User Section */}
              {!user ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/auth/register")}
                    className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-full hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Đăng ký
                  </button>
<button
                    onClick={() => navigate("/auth/login")}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:border-gray-800 hover:shadow-md transition-all duration-200"
                  >
                    Đăng nhập
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    className="flex items-center space-x-3 p-2 pr-4 border border-gray-300 rounded-full hover:shadow-md transition-all duration-200 bg-white"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <FaBars className="w-3 h-3 text-gray-600" />
                    <div className="flex items-center space-x-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">Xem và chỉnh sửa hồ sơ</p>
                      </div>
                      <div className="py-2">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          Tin nhắn
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          Danh sách yêu thích
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          Chuyến đi
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          Cho thuê chỗ ở của bạn
                        </a>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          Trung tâm trợ giúp
                        </a>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[65vh] px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Không chỉ là
            <span className="block bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              nơi ở
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Khám phá những trải nghiệm độc đáo và tạo nên những kỷ niệm đáng nhớ
          </p>
        </div>

        {/* Enhanced Search Box */}
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:divide-x divide-gray-200">

              {/* Location */}
              <div className="p-4 hover:bg-gray-50 transition-colors rounded-l-xl cursor-pointer group">
                <label className="block text-xs font-semibold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">
                  Địa điểm
                </label>
                <input
                  type="text"
                  placeholder="Bạn sắp đi đâu?"
                  className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none font-medium"
                />
              </div>

              {/* Check-in */}
              <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <label className="block text-xs font-semibold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">
                  Nhận phòng
                </label>
                <span className="text-sm text-gray-400 font-medium">Thêm ngày</span>
              </div>

              {/* Check-out */}
              <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <label className="block text-xs font-semibold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">
                  Trả phòng
                </label>
                <span className="text-sm text-gray-400 font-medium">Thêm ngày</span>
              </div>

              {/* Guests */}
              <div className="p-4 hover:bg-gray-50 transition-colors rounded-r-xl cursor-pointer group relative">
                <label className="block text-xs font-semibold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">
                  Khách
                </label>
                <span className="text-sm text-gray-400 font-medium">Thêm khách</span>

                {/* Search Button */}
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 group">
                  <FaSearch className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex justify-center mt-6 space-x-4">
            <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium">
              Linh hoạt về ngày
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200 font-medium">
              Tìm kiếm theo bản đồ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;