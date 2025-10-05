import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaArrowRight, FaSearch, FaFilter } from "react-icons/fa";
import { getPaginatedLocationsApi, locationApi } from "@/services/locationApi";
import { useNavigate } from "react-router-dom";
import Header from "../_components/header";
import Footer from "../_components/footer";

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  hinhAnh: string;
}

export default function AllLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        let res;
        
        // Try the paginated API first
        try {
          res = await getPaginatedLocationsApi(currentPage, itemsPerPage, searchTerm);
          console.log("Paginated API Response:", res);
        } catch (paginatedError) {
          console.warn("Paginated API failed, trying fallback API:", paginatedError);
          // Fallback to the original API
          res = await locationApi.getLocations(currentPage, itemsPerPage);
          console.log("Fallback API Response:", res);
        }
        
        console.log("API Response received successfully");
        
        // Handle response structure from /api/vi-tri/phan-trang-tim-kiem
        let locationsData: Location[] = [];
        let totalElements = 0;
        
        // Handle different possible response structures
        if ((res as any)?.content?.data && Array.isArray((res as any).content.data)) {
          locationsData = (res as any).content.data;
          totalElements = (res as any).content.totalElements || 0;
        } else if ((res as any)?.content && Array.isArray((res as any).content)) {
          locationsData = (res as any).content;
          totalElements = (res as any).totalElements || 0;
        } else if ((res as any)?.data?.content?.data && Array.isArray((res as any).data.content.data)) {
          locationsData = (res as any).data.content.data;
          totalElements = (res as any).data.content.totalElements || 0;
        } else if ((res as any)?.data?.content && Array.isArray((res as any).data.content)) {
          locationsData = (res as any).data.content;
          totalElements = (res as any).data.totalElements || 0;
        } else if ((res as any)?.data && Array.isArray((res as any).data)) {
          locationsData = (res as any).data;
        } else if (Array.isArray(res)) {
          locationsData = res;
        }
        
        console.log(`Loaded ${locationsData.length} locations successfully`);
        
        setLocations(locationsData);
        setTotalPages(Math.ceil(totalElements / itemsPerPage));
      } catch (error) {
        console.error("Lỗi fetch locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [currentPage, searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm !== "") {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
              <FaMapMarkerAlt className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-semibold">Tất cả địa điểm</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight break-words" style={{
              background: 'linear-gradient(to right, #2563eb, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: '#2563eb'
            }}>
              Khám phá thế giới
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tìm hiểu và khám phá những địa điểm tuyệt vời trên khắp thế giới. 
              Mỗi nơi đều mang đến những trải nghiệm độc đáo và đáng nhớ.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm hoặc thành phố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                <div className="bg-gray-200 rounded-lg h-5 mb-2"></div>
                <div className="bg-gray-200 rounded-lg h-4 w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                Hiển thị {locations.length} địa điểm
                {searchTerm && ` cho "${searchTerm}"`}
              </p>
              <div className="flex items-center space-x-2 text-gray-600">
                <FaFilter className="w-4 h-4" />
                <span className="text-sm">Sắp xếp theo mặc định</span>
              </div>
            </div>

            {/* Locations Grid */}
            {locations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {locations.map((loc) => (
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
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
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
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Trước
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaMapMarkerAlt className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {searchTerm ? 'Không tìm thấy địa điểm' : 'Không có địa điểm nào'}
                </h3>
                <p className="text-gray-500 mb-8">
                  {searchTerm 
                    ? `Không tìm thấy địa điểm nào phù hợp với "${searchTerm}". Hãy thử từ khóa khác.`
                    : 'Hiện tại chưa có địa điểm nào được thêm vào hệ thống.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Back to Top */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          ↑
        </button>
      </div>
      
      <Footer />
    </div>
  );
}
