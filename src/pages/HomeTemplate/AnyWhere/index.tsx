import React from "react";
import { FaHome, FaStar, FaTree, FaPaw } from "react-icons/fa";

interface Place {
  id: number;
  title: string;
  img: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const places: Place[] = [
  {
    id: 1,
    title: "Toàn bộ nhà",
    img: "https://anphatgroups.vn/upload/post/mau-biet-thu-dep-9680.jpg",
    icon: <FaHome className="w-6 h-6" />,
    description: "Không gian riêng tư hoàn toàn",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Chỗ ở độc đáo",
    img: "https://cafefcdn.com/203337114487263232/2023/7/13/1689238368-screenshot-1650-16892344811431460297302-1689240125711-16892401267161897923784.png",
    icon: <FaStar className="w-6 h-6" />,
    description: "Trải nghiệm khác biệt và đặc biệt",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 3,
    title: "Trang trại và thiên nhiên",
    img: "https://sakos.vn/wp-content/uploads/2024/08/an-1.jpg",
    icon: <FaTree className="w-6 h-6" />,
    description: "Hòa mình với thiên nhiên",
    color: "from-green-500 to-green-600"
  },
  {
    id: 4,
    title: "Cho phép mang theo thú cưng",
    img: "https://sakos.vn/wp-content/uploads/2023/05/kham-pha-khong-gian-song-ao-dang-yeu-tai-cac-quan-ca-phe-thu-cung-da-lat-5.jpg",
    icon: <FaPaw className="w-6 h-6" />,
    description: "Cùng thú cưng khám phá",
    color: "from-orange-500 to-orange-600"
  },
];

const AnywhereSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20 shadow-lg">
            <span className="text-gray-700 font-semibold">🏠 Loại hình chỗ ở</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent mb-4">
            Ở bất cứ đâu
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm loại hình chỗ ở phù hợp với phong cách và nhu cầu của bạn
          </p>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {places.map((place) => (
            <div 
              key={place.id} 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-2xl mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={place.img}
                  alt={place.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Icon Overlay */}
                <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${place.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {place.icon}
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Khám phá ngay
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {place.title}
                </h3>
                <p className="text-gray-500 text-sm">{place.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sẵn sàng khám phá?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Tìm kiếm chỗ ở hoàn hảo cho chuyến đi tiếp theo của bạn và tạo nên những kỷ niệm đáng nhớ
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Bắt đầu tìm kiếm
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnywhereSection;
