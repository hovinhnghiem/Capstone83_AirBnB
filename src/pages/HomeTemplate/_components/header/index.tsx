import React, { useState, useEffect } from "react";
import { FaSearch, FaBars, FaGlobe, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "@/services/api"; // axios đã config sẵn

interface User {
  name: string;
  avatar: string;
}
interface LocationItem {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🔑 State cho tính năng tìm kiếm vị trí
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  // ✅ Lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Lấy danh sách vị trí từ API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get("/vi-tri");
        setLocations(data?.content || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách vị trí:", err);
      }
    };
    fetchLocations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
  };

  // ✅ Lọc gợi ý theo từ khoá
  const filteredLocations = locations.filter((loc) =>
    loc.tenViTri.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Chuyển trang khi bấm Tìm kiếm
  const handleSearch = () => {
    if (!selectedLocation) return;
    const params = new URLSearchParams();
    params.set("locationId", String(selectedLocation.id));
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", String(guests));
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-rose-50 via-pink-50 to-red-100">
      {/* Hero Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-house.jpg')",
          filter: "brightness(0.85) saturate(1.1)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-20 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 shadow-xl sticky top-0">
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
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                        >
                          Tin nhắn
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                        >
                          Danh sách yêu thích
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                        >
                          Chuyến đi
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                        >
                          Cho thuê chỗ ở của bạn
                        </a>
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
            <span className="block bg-gradient-to-r from-rose-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
              nơi ở
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Khám phá những trải nghiệm độc đáo và tạo nên những kỷ niệm đáng nhớ
          </p>
        </div>

        {/* Search Box */}
        <div className="w-full max-w-4xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-2 ring-1 ring-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:divide-x divide-gray-200">

              {/* Địa điểm */}
              <div className="p-4 hover:bg-gray-50/50 transition-colors rounded-l-xl relative">
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedLocation(null);
                  }}
                  placeholder="Bạn sắp đi đâu?"
                  className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none font-medium"
                />
                {/* Gợi ý vị trí */}
                {searchTerm && !selectedLocation && (
                  <ul className="absolute z-50 mt-1 w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl max-h-60 overflow-auto shadow-lg ring-1 ring-white/10">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc) => (
                        <li
                          key={loc.id}
                          onClick={() => {
                            setSelectedLocation(loc);
                            setSearchTerm(`${loc.tenViTri}, ${loc.tinhThanh}`);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-rose-50 text-sm text-gray-700 hover:text-rose-700 transition-colors"
                        >
                          {loc.tenViTri} – {loc.tinhThanh}, {loc.quocGia}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-400">
                        Không tìm thấy
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Check-in */}
              <div className="p-4 hover:bg-gray-50/50 transition-colors">
                <label className="block text-xs font-semibold text-gray-800 mb-1">Nhận phòng</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-sm text-gray-700 bg-transparent border-none outline-none"
                />
              </div>

              {/* Check-out */}
              <div className="p-4 hover:bg-gray-50/50 transition-colors">
                <label className="block text-xs font-semibold text-gray-800 mb-1">Trả phòng</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-sm text-gray-700 bg-transparent border-none outline-none"
                />
              </div>

              {/* Guests + Search Button */}
              <div className="p-4 hover:bg-gray-50/50 transition-colors rounded-r-xl relative flex items-center">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-800 mb-1">Khách</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-sm text-gray-700 min-w-[2ch] text-center">{guests}</span>
                    <button
                      onClick={() => setGuests((g) => g + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!selectedLocation}
                  className={`ml-auto p-4 rounded-xl shadow-lg transition-all duration-200 ${
                    selectedLocation
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 hover:scale-105 shadow-rose-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex justify-center mt-6 space-x-4">
            <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
              Linh hoạt về ngày
            </button>
            <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
              Tìm kiếm theo bản đồ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;