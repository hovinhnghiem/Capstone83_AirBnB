import React from "react";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import SearchBar from "./search-bar";

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-[75vh] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center mb-12 max-w-5xl">
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Không chỉ là
            <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
              nơi ở
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Khám phá những trải nghiệm độc đáo và tạo nên những kỷ niệm đáng nhớ tại những địa điểm tuyệt vời nhất
          </p>
        </div>

        {/* Enhanced Search Box */}
        <div className="w-full max-w-5xl">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <SearchBar />
            
            {/* Enhanced Quick Filters */}
            <div className="flex flex-wrap justify-center mt-8 gap-4">
              <button className="flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold">
                <FaCalendarAlt className="mr-2" />
                Linh hoạt về ngày
              </button>
              <button className="flex items-center px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 font-semibold">
                <FaMapMarkerAlt className="mr-2" />
                Tìm kiếm theo bản đồ
              </button>
              <button className="flex items-center px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 font-semibold">
                <FaUsers className="mr-2" />
                Trải nghiệm độc đáo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400/30 rounded-full animate-bounce delay-2000"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-pink-400/30 rounded-full animate-bounce delay-3000"></div>
    </div>
  );
};

export default HeroSection;
