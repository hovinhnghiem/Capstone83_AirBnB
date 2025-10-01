import React from "react";
import SearchBar from "./search-bar";

const HeroSection: React.FC = () => {
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
          <SearchBar />
          
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

export default HeroSection;
