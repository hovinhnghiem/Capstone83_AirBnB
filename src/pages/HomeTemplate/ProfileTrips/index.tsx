import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaEdit, FaArrowLeft, FaPlane, FaHome, FaClock, FaSync } from "react-icons/fa";
import { getBookingsByUserIdApi } from "@/services/booking.api";
import { getRoomByIdApi } from "@/services/room.api";
import { getUser } from "@/services/auth.api";
import type { CurrentUser } from "@/interfaces/auth.interface";
import type { Booking } from "@/interfaces/booking.interface";
import type { Room } from "@/interfaces/room.interface";
import SimpleHeader from "../_components/simple-header";

interface BookingWithRoom extends Booking {
  room: Room;
}

const ProfileTrips: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      fetchUserBookings(currentUser.id);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchUserBookings = async (userId: number) => {
    try {
      setLoading(true);
      console.log("Fetching bookings for user ID:", userId);
      const userBookings = await getBookingsByUserIdApi(userId);
      console.log("Raw user bookings:", userBookings);
      
      if (!userBookings || userBookings.length === 0) {
        console.log("No bookings found for user");
        setBookings([]);
        return;
      }
      
      // Fetch room details for each booking
      const bookingsWithRooms = await Promise.all(
        userBookings.map(async (booking) => {
          try {
            console.log("Fetching room details for booking:", booking);
            const room = await getRoomByIdApi(booking.maPhong);
            console.log("Room details:", room);
            return { ...booking, room };
          } catch (error) {
            console.error(`Error fetching room ${booking.maPhong}:`, error);
            return { ...booking, room: null };
          }
        })
      );

      const validBookings = bookingsWithRooms.filter(booking => booking.room !== null) as BookingWithRoom[];
      console.log("Valid bookings with rooms:", validBookings);
      setBookings(validBookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <SimpleHeader />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                <FaPlane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
              </div>
              <p className="text-gray-600 text-lg font-medium">Đang tải thông tin chuyến đi...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SimpleHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Trang chủ
          </button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <FaPlane className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Chuyến đi của tôi
            </h1>
            <p className="text-gray-600 text-xl">Khám phá và quản lý những hành trình đáng nhớ</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <FaHome className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                  <p className="text-gray-600">Tổng chuyến đi</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <FaCalendarAlt className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(booking => new Date(booking.ngayDen) > new Date()).length}
                  </p>
                  <p className="text-gray-600">Sắp tới</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <FaClock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(booking => new Date(booking.ngayDen) <= new Date()).length}
                  </p>
                  <p className="text-gray-600">Đã hoàn thành</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Xin chào, tôi là {user?.name}
                </h2>
                <p className="text-gray-600 text-lg">
                  Tham gia từ {new Date(user?.birthday || "").getFullYear()}
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <FaCalendarAlt className="w-4 h-4 mr-1" />
                  {user?.email}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => user && fetchUserBookings(user.id)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
              >
                <FaSync className="mr-2" />
                Làm mới
              </button>
              <button
                onClick={() => navigate("/profile/edit")}
                className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <FaEdit className="mr-2" />
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chuyến đi của bạn</h3>
                <p className="text-gray-600 text-lg">{bookings.length} chuyến đi đã đặt</p>
              </div>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaPlane className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có chuyến đi nào</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Bạn chưa đặt phòng nào. Hãy khám phá và tạo nên những kỷ niệm đáng nhớ!
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Khám phá ngay
              </button>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex flex-col lg:flex-row">
                    {/* Room Image */}
                    <div className="lg:w-80 flex-shrink-0">
                      <div className="relative group">
                        <img
                          src={booking.room.hinhAnh}
                          alt={booking.room.tenPhong}
                          className="w-full h-64 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                          onClick={() => navigate(`/rooms/${booking.room.id}`)}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button 
                            className="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-white transition-colors"
                            onClick={() => navigate(`/rooms/${booking.room.id}`)}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                        <button className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                          <FaHeart className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 
                            className="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => navigate(`/rooms/${booking.room.id}`)}
                          >
                            {booking.room.tenPhong}
                          </h4>
                          <div className="flex items-center text-gray-600 mb-3">
                            <FaMapMarkerAlt className="w-5 h-5 mr-2 text-blue-500" />
                            <span className="text-lg">Toàn bộ căn hộ dịch vụ tại Bình Thạnh</span>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <p className="text-2xl font-bold text-blue-600 mb-1">
                            {formatPrice(booking.room.giaTien)}
                          </p>
                          <p className="text-gray-500">/tháng</p>
                        </div>
                      </div>

                      {/* Room Features */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          <FaUsers className="w-4 h-4 mr-1" />
                          {booking.soLuongKhach} khách
                        </div>
                        <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {booking.room.phongNgu} phòng ngủ
                        </div>
                        <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          {booking.room.giuong} giường
                        </div>
                        <div className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                          {booking.room.phongTam} phòng tắm
                        </div>
                        {booking.room.wifi && (
                          <div className="flex items-center bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                            Wifi
                          </div>
                        )}
                        {booking.room.bep && (
                          <div className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            Bếp
                          </div>
                        )}
                        {booking.room.dieuHoa && (
                          <div className="flex items-center bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                            Điều hòa
                          </div>
                        )}
                        {booking.room.mayGiat && (
                          <div className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                            Máy giặt
                          </div>
                        )}
                      </div>

                      {/* Booking Dates & Status */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center text-gray-700 mb-2 sm:mb-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-lg">
                                {formatDate(booking.ngayDen)} - {formatDate(booking.ngayDi)}
                              </p>
                              <p className="text-sm text-gray-500">Thời gian lưu trú</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className={`px-4 py-2 rounded-full font-semibold ${
                              new Date(booking.ngayDen) > new Date() 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {new Date(booking.ngayDen) > new Date() ? 'Sắp tới' : 'Đã hoàn thành'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTrips;
