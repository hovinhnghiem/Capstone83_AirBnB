import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaHeart, FaMapMarkerAlt, FaUsers, FaBed, FaBath, FaWifi, FaUtensils, FaSnowflake, FaStar, FaFilter } from "react-icons/fa";
import api from "@/services/api";
import type { Room } from "@/interfaces/room.interface";
import SimpleHeader from "@/pages/HomeTemplate/_components/simple-header";
import Footer from "@/pages/HomeTemplate/_components/footer";
import FilterSidebar from "@/components/FilterSidebar";

const RoomsPage = () => {
  const [params] = useSearchParams();
  const locationId = params.get("locationId");
  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const guests = params.get("guests");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    bedrooms: [] as number[],
    guests: [] as number[],
    rating: 0,
    priceRange: [0, 1000] as [number, number]
  });

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

  // Filter and sort rooms
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = [...rooms];

    // Apply filters
    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter(room => filters.bedrooms.includes(room.giuong));
    }

    if (filters.guests.length > 0) {
      filtered = filtered.filter(room => filters.guests.includes(room.khach));
    }

    // Note: Rating filter disabled as Room interface doesn't include rating property
    // if (filters.rating > 0) {
    //   filtered = filtered.filter(room => room.saoBinhLuan >= filters.rating);
    // }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      filtered = filtered.filter(room => 
        room.giaTien >= filters.priceRange[0] && room.giaTien <= filters.priceRange[1]
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.giaTien - b.giaTien);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.giaTien - a.giaTien);
        break;
      case 'rating':
        // Note: Rating sort disabled as Room interface doesn't include rating property
        // filtered.sort((a, b) => (b.saoBinhLuan || 0) - (a.saoBinhLuan || 0));
        break;
      case 'newest':
        // Assuming newer rooms have higher IDs
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [rooms, filters, sortBy]);

  // Remove date validation - users can browse rooms without selecting dates

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <SimpleHeader />

      <main className="flex-1">
        {/* Enhanced Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-[88px] z-10 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Title and Location */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Chỗ ở tuyệt vời đang chờ bạn
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">
                    {locationName || "Đang tải vị trí..."}
                  </span>
                  {checkIn && checkOut && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{new Date(checkIn).toLocaleDateString('vi-VN')} - {new Date(checkOut).toLocaleDateString('vi-VN')}</span>
                    </>
                  )}
                  {guests && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{guests} khách</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Results Count */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold">{filteredAndSortedRooms.length}</div>
                <div className="text-sm opacity-90">chỗ ở</div>
              </div>
            </div>

            {/* Enhanced Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex flex-wrap gap-3">
                {/* Filter Button with Active Count */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                    showFilters || filters.bedrooms.length > 0 || filters.guests.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-2 border-transparent'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <FaFilter className="w-4 h-4" />
                  Bộ lọc
                  {(filters.bedrooms.length > 0 || filters.guests.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                    <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-bold">
                      {[filters.bedrooms.length > 0, filters.guests.length > 0, filters.priceRange[0] > 0 || filters.priceRange[1] < 1000].filter(Boolean).length}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex items-center gap-2 px-7 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="relevance">Độ liên quan</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room List and Map */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Rooms List */}
            <div className="xl:col-span-3">
              {loading ? (
                <div className="space-y-8">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className="animate-pulse">
                        <div className="flex gap-6 p-6">
                          <div className="w-64 h-48 bg-gray-200 rounded-xl"></div>
                          <div className="flex-1 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            <div className="flex gap-4">
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                              <div className="h-4 bg-gray-200 rounded w-18"></div>
                            </div>
                            <div className="h-12 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredAndSortedRooms.map((room) => (
                    <div 
                      key={room.id} 
                      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex gap-6 p-6">
                        {/* Room Image */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={room.hinhAnh}
                            alt={room.tenPhong}
                            className="w-64 h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            Mới
                          </div>
                          <button className="absolute top-4 right-4 p-3 bg-white/90 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300 shadow-lg hover:scale-110">
                            <FaHeart className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Room Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                              {room.tenPhong}
                            </h3>
                          </div>
                          
                          {/* Room Features */}
                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              <FaUsers className="w-4 h-4" />
                              {room.khach} khách
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              <FaBed className="w-4 h-4" />
                              {room.phongNgu} phòng ngủ
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                              <FaBath className="w-4 h-4" />
                              {room.phongTam} phòng tắm
                            </div>
                            {room.wifi && (
                              <div className="flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                <FaWifi className="w-4 h-4" />
                                WiFi
                              </div>
                            )}
                            {room.bep && (
                              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                <FaUtensils className="w-4 h-4" />
                                Bếp
                              </div>
                            )}
                            {room.dieuHoa && (
                              <div className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                                <FaSnowflake className="w-4 h-4" />
                                Điều hòa
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed mb-4">
                            {room.moTa}
                          </p>

                          {/* Rating and Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                                <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                                <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                                <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                                <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                              </div>
                              <span className="text-sm text-gray-500">(4.8)</span>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  ${room.giaTien}
                                </span>
                                <span className="text-gray-500 text-sm">/ đêm</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-6">
                            <button 
                              onClick={() => {
                                window.location.href = `/rooms/${room.id}?checkIn=${encodeURIComponent(checkIn || '')}&checkOut=${encodeURIComponent(checkOut || '')}&guests=${encodeURIComponent(guests || '1')}`;
                              }}
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredAndSortedRooms.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaBed className="w-16 h-16 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Không tìm thấy chỗ ở phù hợp
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Hãy thử điều chỉnh bộ lọc, thay đổi ngày tháng hoặc tìm kiếm khu vực khác
                      </p>
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        Thay đổi tìm kiếm
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Map Section */}
            <div className="xl:col-span-2">
              <div className="sticky top-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    <FaMapMarkerAlt className="w-6 h-4" />
                    Vị trí trên bản đồ
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {locationName || "Đang tải vị trí..."}
                  </p>
                </div>
                <div className="relative">
                  <iframe
                    title="map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                    className="w-full h-[400px]"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{filteredAndSortedRooms.length}</div>
                      <div className="text-xs text-gray-500">chỗ ở</div>
                    </div>
                  </div>
                </div>
                
                {/* Map Controls */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span>Xem tất cả vị trí</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                      Mở bản đồ lớn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  );
};

export default RoomsPage;