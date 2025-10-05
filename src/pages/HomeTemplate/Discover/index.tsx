import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { locationApi } from "@/services/locationApi";
import { useNavigate } from "react-router-dom";

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  hinhAnh: string;
}

export default function Discover() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const res = await locationApi.getLocations(1, 8); 
        console.log("API Response:", res);
        
        // Handle different response structures
        let locationsData: Location[] = [];
        if ((res as any)?.data?.content?.data && Array.isArray((res as any).data.content.data)) {
          locationsData = (res as any).data.content.data;
        } else if ((res as any)?.data?.content && Array.isArray((res as any).data.content)) {
          locationsData = (res as any).data.content;
        } else if ((res as any)?.data && Array.isArray((res as any).data)) {
          locationsData = (res as any).data;
        } else if (Array.isArray(res)) {
          locationsData = res;
        }
        
        console.log("Locations data:", locationsData);
        setLocations(locationsData);
      } catch (error) {
        console.error("Lỗi fetch locations:", error);
        setLocations([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16 max-w-6xl mx-auto">
        <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
          <FaMapMarkerAlt className="w-5 h-5 text-blue-600 mr-2" />
          <span className="text-blue-700 font-semibold">Khám phá ngay</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-5 font-bold mb-4 leading-tight break-words" style={{
          background: 'linear-gradient(to right, #2563eb, #9333ea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: '#2563eb' // Fallback color for browsers that don't support bg-clip-text
        }}>
          Điểm đến phổ biến
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Khám phá những địa điểm được yêu thích nhất và tạo nên những kỷ niệm đáng nhớ
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-32 mb-4"></div>
              <div className="bg-gray-200 rounded-lg h-4 mb-2"></div>
              <div className="bg-gray-200 rounded-lg h-3 w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {Array.isArray(locations) && locations.length > 0 ? locations.map((loc) => (
            <div
              key={loc.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => navigate(`/rooms?locationId=${loc.id}`)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-2xl mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={loc.hinhAnh}
                  alt={loc.tenViTri}
                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center px-2">
                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 break-words">
                  {loc.tenViTri}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-1 break-words">{loc.tinhThanh}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy địa điểm</h3>
              <p className="text-gray-500">Vui lòng thử lại sau hoặc kiểm tra kết nối mạng</p>
            </div>
          )}
        </div>
      )}

      {/* CTA Button */}
      <div className="text-center mt-12">
        <button 
          onClick={() => navigate('/locations')}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Xem tất cả địa điểm
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </section>
  );
}
