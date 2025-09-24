import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import type { Room } from "@/interfaces/room.interface";

const RoomsPage = () => {
  const [params] = useSearchParams();
  const locationId = params.get("locationId");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const guests = params.get("guests");

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;
      setLoading(true);
      try {
        const [roomsRes, locationsRes] = await Promise.all([
          api.get(`/phong-thue/lay-phong-theo-vi-tri`, { params: { maViTri: locationId } }),
          api.get(`/vi-tri`),
        ]);

        setRooms(roomsRes.data?.content || []);
        const allLocations = locationsRes.data?.content || locationsRes.data || [];
        const found = Array.isArray(allLocations)
          ? allLocations.find((l: any) => String(l.id) === String(locationId))
          : null;
        if (found) setLocationName(`${found.tenViTri}${found.tinhThanh ? ", " + found.tinhThanh : ""}`);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locationId]);

  const mapQuery = useMemo(() => {
    if (locationName) return locationName;
    return "Vietnam";
  }, [locationName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      {/* Airbnb-style Navigation Header */}
      <header className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-white text-2xl font-bold flex items-center gap-2 drop-shadow-md">
              <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>Airbnb</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-white/95 backdrop-blur-sm border border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-white/10">
              <div className="px-6 py-3 text-sm font-medium text-gray-800 border-r border-gray-300 rounded-l-full">
                {locationName || "Chọn địa điểm"}
              </div>
              <div className="px-6 py-3 text-sm font-medium text-gray-800 border-r border-gray-300">
                {(checkIn || checkOut) ? `${checkIn || "?"} - ${checkOut || "?"}` : "Thêm ngày"}
              </div>
              <div className="px-6 py-3 text-sm text-gray-600 pr-4">
                {guests ? `${guests} khách` : "Thêm khách"}
              </div>
              <button className="p-2 mr-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Right Menu */}
            <div className="flex items-center gap-4">
              <button className="hidden md:block px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 backdrop-blur-sm">
                Trở thành chủ nhà
              </button>
              
              {/* Language & Profile */}
              <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-white/10 rounded-full transition-colors duration-200">
                  <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-2 pl-3 pr-2 py-2 bg-white/95 backdrop-blur-sm border border-white/20 rounded-full hover:shadow-md transition-all duration-200 cursor-pointer ring-1 ring-white/10">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <div className="flex items-center bg-white/95 backdrop-blur-sm border border-white/20 rounded-full shadow-lg ring-1 ring-white/10">
              <div className="flex-1 px-4 py-3">
                <div className="text-sm font-medium text-gray-800">Khu vực bán đồ đã chọn</div>
                <div className="text-xs text-gray-500">16 thg 4 - 14 thg 5 · Thêm khách</div>
              </div>
              <button className="p-3 mr-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content Header Section */}
      <div className="bg-gradient-to-br from-white via-rose-50 to-pink-50 border-b border-rose-200 sticky top-[88px] z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Row 1: Title and Location */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
              Chỗ ở tuyệt vời dang chờ bạn
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full w-fit shadow-md">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <p className="font-medium text-sm drop-shadow-sm">
                {locationName ? `Khám phá ${locationName}` : "Đang tải vị trí..."}
              </p>
            </div>
          </div>

          {/* Row 2: Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: "🏠", label: "Loại nơi ở" },
              { icon: "💰", label: "Giá" },
              { icon: "⚡", label: "Đặt ngay" },
              { icon: "🛏️", label: "Phòng ngủ" },
              { icon: "🔍", label: "Bộ lọc khác" }
            ].map(({ icon, label }) => (
              <button
                key={label}
                className="group px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-rose-200 text-rose-700 font-medium hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-md transition-all duration-300 text-sm shadow-sm"
              >
                <span className="mr-1 group-hover:scale-110 transition-transform duration-300">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Rooms List */}
          <div className="xl:col-span-3">
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-40 bg-gradient-to-r from-rose-100 to-pink-100 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {rooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl p-5 border border-rose-200 hover:border-rose-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div className="flex gap-5">
                      {/* Room Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={room.hinhAnh}
                          alt={room.tenPhong}
                          className="w-52 h-36 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Mới
                        </div>
                      </div>

                      {/* Room Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
                            {room.tenPhong}
                          </h3>
                          <button className="p-2 rounded-full text-rose-400 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:scale-110 transition-all duration-300">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </button>
                        </div>
                        
                        {/* Room Stats */}
                        <div className="flex flex-wrap gap-4 mt-3">
                          {[
                            { icon: "👥", value: room.khach, label: "khách" },
                            { icon: "🛏️", value: room.giuong, label: "giường" },
                            { icon: "🚿", value: room.phongTam, label: "phòng tắm" }
                          ].map(({ icon, value, label }) => (
                            <div key={label} className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="text-base">{icon}</span>
                              <span className="font-medium">{value}</span>
                              <span>{label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Description */}
                        <p className="mt-3 text-gray-600 line-clamp-2 text-sm leading-relaxed">
                          {room.moTa}
                        </p>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                              ${room.giaTien}
                            </span>
                            <span className="text-gray-500 text-sm">/ đêm</span>
                          </div>
                          <a href={`/rooms/${room.id}?checkIn=${encodeURIComponent(String((new URLSearchParams(window.location.search)).get('checkIn')||''))}&checkOut=${encodeURIComponent(String((new URLSearchParams(window.location.search)).get('checkOut')||''))}&guests=${encodeURIComponent(String((new URLSearchParams(window.location.search)).get('guests')||''))}`} className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                            Xem chi tiết
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {rooms.length === 0 && !loading && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🏠</div>
                    <div className="text-xl font-semibold text-gray-600 mb-2">
                      Không tìm thấy phòng phù hợp
                    </div>
                    <div className="text-gray-500">
                      Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khu vực khác
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="xl:col-span-2">
            <div className="sticky top-40 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-rose-200 shadow-xl">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span>📍</span>
                  Vị trí trên bản đồ
                </h3>
              </div>
              <iframe
                title="map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className="w-full h-[500px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RoomsPage;