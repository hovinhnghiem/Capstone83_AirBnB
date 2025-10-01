import React, { useState, useEffect } from "react";
import { FaBars, FaGlobe, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  avatar: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center ring-1 ring-white/10">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-md">
                Airbnb
              </span>
            </div>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a
                href="#"
                className="relative text-white font-medium hover:text-white/80 transition-colors group"
              >
                Nơi ở
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-white transform scale-x-100 transition-transform"></span>
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                Trải nghiệm
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                Trải nghiệm trực tuyến
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:block text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-full transition-all backdrop-blur-sm">
                Cho thuê chỗ ở của bạn
              </button>

              <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <FaGlobe className="w-4 h-4 text-white/90" />
              </button>

              {!user ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/auth/register")}
                    className="px-6 py-2.5 bg-white/95 backdrop-blur-sm text-rose-600 font-medium rounded-full hover:bg-white hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg ring-1 ring-white/10"
                  >
                    Đăng ký
                  </button>
                  <button
                    onClick={() => navigate("/auth/login")}
                    className="px-6 py-2.5 border-2 border-white/30 text-white font-medium rounded-full hover:border-white hover:bg-white/10 hover:shadow-md transition-all duration-200 backdrop-blur-sm"
                  >
                    Đăng nhập
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">Hello, {user.name}</span>
                  <div className="relative">
                    <button
                      className="flex items-center space-x-3 p-2 pr-4 bg-white/95 backdrop-blur-sm border border-white/20 rounded-full hover:shadow-md transition-all duration-200 ring-1 ring-white/10"
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
                      <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 py-2 z-50 ring-1 ring-white/10">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">
                            Xem và chỉnh sửa hồ sơ
                          </p>
                        </div>
                        <div className="py-2">
                        <button
                            onClick={() => {
                              setDropdownOpen(false);
                              navigate("/profile/trips");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700  hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Chuyến đi của tôi
                          </button>
                      
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              navigate("/profile/edit");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700  hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Chỉnh sửa hồ sơ
                          </button>
                      
                        </div>
                        <div className="border-t border-gray-100 py-2">
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                          >
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
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;