import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMars, FaVenus, FaCamera, FaArrowLeft, FaSave, FaCheck } from "react-icons/fa";
import { updateUserApi, getUser } from "@/services/auth.api";
import type { CurrentUser } from "@/interfaces/auth.interface";
import SimpleHeader from "../_components/simple-header";

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: true,
    avatar: "",
  });

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || "",
        birthday: currentUser.birthday,
        gender: currentUser.gender,
        avatar: currentUser.avatar || "",
      });
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const updatedUser = await updateUserApi(user.id, formData);
      if (updatedUser) {
        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile/trips");
        }, 2000);
      } else {
        alert("Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SimpleHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/profile/trips")}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <FaUser className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chỉnh sửa hồ sơ
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Cập nhật thông tin cá nhân của bạn</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
            <FaCheck className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-green-700 font-medium">Cập nhật thông tin thành công! Đang chuyển hướng...</span>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block group">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Avatar"
                        className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                        <FaUser className="w-20 h-20 text-blue-500" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    >
                      <FaCamera className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 font-medium">Cập nhật ảnh đại diện</p>
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <p className="text-xs text-gray-600">
                      <strong>Mẹo:</strong> Sử dụng ảnh rõ nét và chuyên nghiệp để tạo ấn tượng tốt với chủ nhà.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-8">
                {/* Name */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-focus-within:bg-blue-200 transition-colors">
                      <FaUser className="w-4 h-4 text-blue-600" />
                    </div>
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-focus-within:bg-purple-200 transition-colors">
                      <FaEnvelope className="w-4 h-4 text-purple-600" />
                    </div>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Nhập địa chỉ email của bạn"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-focus-within:bg-green-200 transition-colors">
                      <FaPhone className="w-4 h-4 text-green-600" />
                    </div>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    placeholder="Nhập số điện thoại của bạn"
                  />
                </div>

                {/* Birthday */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-focus-within:bg-orange-200 transition-colors">
                      <FaCalendarAlt className="w-4 h-4 text-orange-600" />
                    </div>
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <FaMars className="w-3 h-3 text-pink-600" />
                      <FaVenus className="w-3 h-3 text-pink-600 ml-1" />
                    </div>
                    Giới tính
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === true}
                        onChange={() => setFormData(prev => ({ ...prev, gender: true }))}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all ${
                        formData.gender === true 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300 group-hover:border-blue-300'
                      }`}>
                        {formData.gender === true && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <FaMars className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="font-medium">Nam</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === false}
                        onChange={() => setFormData(prev => ({ ...prev, gender: false }))}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all ${
                        formData.gender === false 
                          ? 'border-pink-500 bg-pink-500' 
                          : 'border-gray-300 group-hover:border-pink-300'
                      }`}>
                        {formData.gender === false && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <FaVenus className="w-5 h-5 mr-2 text-pink-500" />
                      <span className="font-medium">Nữ</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang cập nhật...
                      </span>
                    ) : success ? (
                      <span className="flex items-center justify-center">
                        <FaCheck className="mr-2" />
                        Đã cập nhật thành công!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FaSave className="mr-2" />
                        Cập nhật thông tin
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
