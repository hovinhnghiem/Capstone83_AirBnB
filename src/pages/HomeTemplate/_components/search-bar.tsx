import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface LocationItem {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
}

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = "" }) => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

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

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) =>
      loc.tenViTri.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  const handleSearch = () => {
    if (!selectedLocation) {
      alert("Vui lòng chọn địa điểm!");
      return;
    }
    if (!checkIn) {
      alert("Vui lòng chọn ngày nhận phòng!");
      return;
    }
    if (!checkOut) {
      alert("Vui lòng chọn ngày trả phòng!");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      alert("Ngày trả phòng phải sau ngày nhận phòng!");
      return;
    }
    if (new Date(checkIn) < new Date(new Date().setHours(0, 0, 0, 0))) {
      alert("Ngày nhận phòng không thể trong quá khứ!");
      return;
    }
    
    const params = new URLSearchParams();
    params.set("locationId", String(selectedLocation.id));
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("guests", String(guests));
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-2 ring-1 ring-white/10 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:divide-x divide-gray-200">
        {/* Địa điểm */}
        <div className="p-4 hover:bg-gray-50/50 transition-colors rounded-l-xl relative">
          <label className="block text-xs font-semibold text-gray-800 mb-1">Địa điểm</label>
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
                <li className="px-4 py-2 text-sm text-gray-400">Không tìm thấy</li>
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
            disabled={!selectedLocation || !checkIn || !checkOut}
            className={`ml-auto p-4 rounded-xl shadow-lg transition-all duration-200 ${
              selectedLocation && checkIn && checkOut
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 hover:scale-105 shadow-rose-200"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaSearch className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
