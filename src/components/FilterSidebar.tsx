import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaBed, FaUsers, FaStar, FaDollarSign, FaFilter, FaTimes, FaSort } from 'react-icons/fa';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    bedrooms: number[];
    guests: number[];
    rating: number;
    priceRange: [number, number];
  };
  onFiltersChange: (filters: {
    bedrooms: number[];
    guests: number[];
    rating: number;
    priceRange: [number, number];
  }) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleBedroomChange = (bedroom: number) => {
    setLocalFilters(prev => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(bedroom)
        ? prev.bedrooms.filter(b => b !== bedroom)
        : [...prev.bedrooms, bedroom]
    }));
  };

  const handleGuestChange = (guest: number) => {
    setLocalFilters(prev => ({
      ...prev,
      guests: prev.guests.includes(guest)
        ? prev.guests.filter(g => g !== guest)
        : [...prev.guests, guest]
    }));
  };

  // Rating filter is currently disabled, so handleRatingChange is not needed
  // const handleRatingChange = (rating: number) => {
  //   setLocalFilters(prev => ({
  //     ...prev,
  //     rating: prev.rating === rating ? 0 : rating
  //   }));
  // };

  const handlePriceRangeChange = (index: number, value: number) => {
    setLocalFilters(prev => {
      const newRange = [...prev.priceRange] as [number, number];
      newRange[index] = value;
      return { ...prev, priceRange: newRange };
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      bedrooms: [],
      guests: [],
      rating: 0,
      priceRange: [0, 1000] as [number, number]
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const sortOptions = [
    { value: 'relevance', label: 'Độ liên quan', icon: '⭐' },
    { value: 'price-low', label: 'Giá thấp đến cao', icon: '💰' },
    { value: 'price-high', label: 'Giá cao đến thấp', icon: '💎' },
    { value: 'rating', label: 'Đánh giá cao nhất', icon: '⭐' },
    { value: 'newest', label: 'Mới nhất', icon: '🆕' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <FaFilter className="w-5 h-5" />
              <h2 className="text-xl font-bold">Bộ lọc & Sắp xếp</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <FaTimes className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Sort By */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaSort className="w-4 h-4 text-blue-500" />
                Sắp xếp theo
              </h3>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                      sortBy === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    {sortBy === option.value && (
                      <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaBed className="w-4 h-4 text-green-500" />
                Số phòng ngủ
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5].map((bedroom) => (
                  <button
                    key={bedroom}
                    onClick={() => handleBedroomChange(bedroom)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      localFilters.bedrooms.includes(bedroom)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaBed className="w-4 h-4" />
                      <span className="font-medium">{bedroom} phòng</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Guests Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUsers className="w-4 h-4 text-purple-500" />
                Số khách
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((guest) => (
                  <button
                    key={guest}
                    onClick={() => handleGuestChange(guest)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      localFilters.guests.includes(guest)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      <span className="font-medium">{guest} khách</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter - Disabled */}
            <div className="opacity-50 pointer-events-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaStar className="w-4 h-4 text-yellow-500" />
                Đánh giá tối thiểu
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Sắp có</span>
              </h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-500">{rating}+ sao</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaDollarSign className="w-4 h-4 text-green-500" />
                Khoảng giá (USD/đêm)
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Từ
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={localFilters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đến
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={localFilters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${localFilters.priceRange[0]}</span>
                    <span>${localFilters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={applyFilters}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                Áp dụng bộ lọc
              </Button>
            </div>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
