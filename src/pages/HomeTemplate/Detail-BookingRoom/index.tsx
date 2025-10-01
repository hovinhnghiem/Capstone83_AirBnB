import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import api from '@/services/api';
import type { Room } from '@/interfaces/room.interface';
import { bookingApi, type BookingPayload } from '@/services/booking.api';
import { commentsApi, type Comment, type CommentPayload } from '@/services/comments.api';
import { useAuthStore } from '@/store/auth.slice';
import SimpleHeader from '@/pages/HomeTemplate/_components/simple-header';
import Footer from '@/pages/HomeTemplate/_components/footer';

export default function DetailBookingRoom() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [checkIn, setCheckIn] = useState<string>(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState<string>(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState<number>(Number(searchParams.get('guests')) || 1);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/phong-thue/${id}`);
        setRoom(res.data?.content || res.data);
      } catch (err: any) {
        setError('Không tải được thông tin phòng');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;
      setCommentsLoading(true);
      try {
        const commentsData = await commentsApi.getByRoom(Number(id));
        setComments(commentsData);
      } catch (err: any) {
        console.error('Lỗi tải bình luận:', err);
      } finally {
        setCommentsLoading(false);
      }
    };
    loadComments();
  }, [id]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [checkIn, checkOut]);

  const total = useMemo(() => {
    if (!room || nights === 0) return 0;
    return room.giaTien * nights;
  }, [room, nights]);

  const handleBook = async () => {
    if (!room || !id) {
      alert('Không tìm thấy thông tin phòng!');
      return;
    }
    
    if (!checkIn) {
      alert('Vui lòng chọn ngày nhận phòng!');
      return;
    }
    
    if (!checkOut) {
      alert('Vui lòng chọn ngày trả phòng!');
      return;
    }
    
    if (new Date(checkIn) >= new Date(checkOut)) {
      alert('Ngày trả phòng phải sau ngày nhận phòng!');
      return;
    }
    
    if (new Date(checkIn) < new Date().setHours(0, 0, 0, 0)) {
      alert('Ngày nhận phòng không thể trong quá khứ!');
      return;
    }
    
    if (!user) {
      alert('Bạn cần đăng nhập để đặt phòng.');
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth/login?redirect=${redirect}`);
      return;
    }
    
    if (guests < 1) {
      alert('Số lượng khách phải ít nhất là 1!');
      return;
    }
    
    if (guests > room.khach) {
      alert(`Số lượng khách không được vượt quá ${room.khach} người!`);
      return;
    }
    
    const payload: BookingPayload = {
      maPhong: Number(id),
      ngayDen: checkIn,
      ngayDi: checkOut,
      soLuongKhach: guests,
      maNguoiDung: user.id,
    };
    
    try {
      const result = await bookingApi.create(payload);
      console.log('Booking created successfully:', result);
      alert('Đặt phòng thành công! Bạn có thể xem chuyến đi trong trang "Chuyến đi của tôi".');
      navigate('/profile/trips');
    } catch (err) {
      console.error('Booking creation failed:', err);
      alert('Đặt phòng thất bại, vui lòng thử lại.');
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để bình luận.');
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth/login?redirect=${redirect}`);
      return;
    }
    if (!newComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận.');
      return;
    }
    if (!id) {
      alert('Không tìm thấy thông tin phòng.');
      return;
    }

    const payload: CommentPayload = {
      maPhong: Number(id),
      maNguoiDung: user.id,
      ngayBinhLuan: new Date().toISOString(),
      noiDung: newComment.trim(),
      saoBinhLuan: rating,
    };

    try {
      const result = await commentsApi.create(payload);
      
      // Create new comment object with current user info
      const newCommentObj = {
        id: result.id || Date.now(),
        maPhong: Number(id),
        maNguoiDung: user.id,
        ngayBinhLuan: new Date().toISOString(),
        noiDung: newComment.trim(),
        saoBinhLuan: rating,
        tenNguoiDung: user.name, // Set the username immediately
      };
      
      console.log('New comment object:', newCommentObj);
      
      // Add new comment to existing comments
      setComments(prevComments => [newCommentObj, ...prevComments]);
      
      // Clear form
      setNewComment('');
      setRating(5);
      
      alert('Bình luận thành công!');
    } catch (err: any) {
      console.error('Comment submission failed:', err);
      alert(`Bình luận thất bại: ${err.response?.data?.message || err.message || 'Vui lòng thử lại.'}`);
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-6">Đang tải...</div>;
  if (error) return <div className="max-w-6xl mx-auto p-6 text-red-600">{error}</div>;
  if (!room) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <SimpleHeader />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          {/* Warning if no dates selected */}
          {(!checkIn || !checkOut) && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-lg">⚠️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Vui lòng chọn ngày nhận và trả phòng</h3>
                  <p className="text-amber-700 text-sm">
                    Để đặt phòng, bạn cần chọn ngày nhận phòng và ngày trả phòng. 
                    <button 
                      onClick={() => navigate('/')}
                      className="text-amber-800 underline hover:text-amber-900 ml-1"
                    >
                      Quay lại trang chủ để tìm kiếm
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Images & Details */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-3 gap-2 mb-4">
            <img src={room.hinhAnh} alt={room.tenPhong} className="col-span-2 h-64 object-cover rounded-xl" />
            <img src={room.hinhAnh} alt="alt" className="h-64 object-cover rounded-xl" />
              </div>

              <h1 className="text-2xl font-bold mb-2">{room.tenPhong}</h1>
              <p className="text-gray-600 mb-4">
                {room.khach} khách · {room.giuong} giường · {room.phongTam} phòng tắm
              </p>

              <div className="border rounded-2xl p-4 mb-6">
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">{room.moTa}</p>
              </div>

              <div className="border rounded-2xl p-4 mb-6">
                <h3 className="font-semibold mb-3">Tiện nghi</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                  <div>Wifi: {room.wifi ? 'Có' : 'Không'}</div>
                  <div>Điều hoà: {room.dieuHoa ? 'Có' : 'Không'}</div>
                  <div>TV: {room.tivi ? 'Có' : 'Không'}</div>
                  <div>Bếp: {room.bep ? 'Có' : 'Không'}</div>
                  <div>Máy giặt: {room.mayGiat ? 'Có' : 'Không'}</div>
                  <div>Hồ bơi: {room.hoBoi ? 'Có' : 'Không'}</div>
                  <div>Đỗ xe: {room.doXe ? 'Có' : 'Không'}</div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Đánh giá và bình luận</h3>
                  <button
                    onClick={() => {
                      if (id) {
                        setCommentsLoading(true);
                        commentsApi.getByRoom(Number(id)).then((result) => {
                          setComments(result);
                          setCommentsLoading(false);
                        }).catch((error) => {
                          console.error('Error refreshing comments:', error);
                          setCommentsLoading(false);
                        });
                      }
                    }}
                    disabled={commentsLoading}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commentsLoading ? 'Đang tải...' : 'Làm mới'}
                  </button>
                </div>
                
                {/* Add Comment Form */}
                {user && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium mb-3">Viết đánh giá của bạn ({user.name})</h4>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bình luận</label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                      />
                    </div>
                    <button
                      onClick={handleSubmitComment}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {commentsLoading ? (
                    <div className="text-center py-4">Đang tải bình luận...</div>
                  ) : comments.length > 0 ? (
                    comments.map((comment, index) => {
                      // Get the actual user ID from either field
                      const userId = comment.maNguoiDung || comment.maNguoiBinhLuan;
                      
                      // Safe data access with better fallbacks
                      let userName = comment.tenNguoiDung || comment.user?.name;
                      
                      // Priority 1: If this is the current logged in user's comment, use current user's name
                      if (userId === user?.id) {
                        userName = user.name || 'Bạn';
                      }
                      // Priority 2: If we already have username, keep it
                      else if (userName) {
                        // Keep existing username
                      }
                      // Priority 3: Try to get user info from localStorage
                      else if (userId && userId > 0) {
                        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                        if (storedUser.id === userId) {
                          userName = storedUser.name || `Người dùng ${userId}`;
                        } else {
                          userName = `Người dùng ${userId}`;
                        }
                      }
                      // Priority 4: Fallback based on content
                      else {
                        const content = comment.noiDung || '';
                        if (content.includes('nghiêm') || content.includes('Nghiêm')) {
                          userName = 'Nghiêm';
                        } else if (content.includes('user') || content.includes('User')) {
                          userName = 'User';
                        } else {
                          userName = 'Khách';
                        }
                      }
                      
                      const userInitial = userName.charAt(0).toUpperCase();
                      const commentContent = comment.noiDung || 'Nội dung trống';
                      const commentDate = comment.ngayBinhLuan ? new Date(comment.ngayBinhLuan).toLocaleDateString('vi-VN') : 'Không có ngày';
                      const rating = comment.saoBinhLuan || 0;

                      return (
                        <div key={comment.id || index} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {userInitial}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800 flex items-center gap-2">
                                {userName}
                                {userName.includes('Người dùng') && (
                                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                    ID: {userId}
                                  </span>
                                )}
                          </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                      className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                                <span className="text-xs text-gray-500">{commentDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-700 leading-relaxed">
                            {commentContent}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {comments.length === 0 ? (
                        "Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!"
                      ) : (
                        <div>
                          <div className="text-red-500 mb-2">Có {comments.length} bình luận nhưng không thể hiển thị</div>
                          <div className="text-sm text-gray-400">
                            Kiểm tra console để xem chi tiết lỗi
                          </div>
                          <button
                            onClick={() => {
                              console.log('🔍 Full comments data:', comments);
                              comments.forEach((comment, index) => {
                                console.log(`Comment ${index}:`, comment);
                              });
                            }}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                          >
                            Log Comments
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Booking Card */}
            <div className="md:col-span-1">
              <div className="border rounded-2xl p-4 sticky top-24">
                <div className="text-2xl font-bold">${room.giaTien} <span className="text-base font-normal text-gray-500">/ đêm</span></div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Nhận phòng *</label>
                    <input 
                      type="date" 
                      value={checkIn} 
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckIn(e.target.value)} 
                      className={`w-full border rounded-lg px-3 py-2 ${
                        checkIn && new Date(checkIn) < new Date().setHours(0, 0, 0, 0) 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`} 
                    />
                    {checkIn && new Date(checkIn) < new Date().setHours(0, 0, 0, 0) && (
                      <p className="text-xs text-red-600 mt-1">Ngày không thể trong quá khứ</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Trả phòng *</label>
                    <input 
                      type="date" 
                      value={checkOut} 
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckOut(e.target.value)} 
                      className={`w-full border rounded-lg px-3 py-2 ${
                        checkOut && checkIn && new Date(checkOut) <= new Date(checkIn)
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`} 
                    />
                    {checkOut && checkIn && new Date(checkOut) <= new Date(checkIn) && (
                      <p className="text-xs text-red-600 mt-1">Ngày trả phòng phải sau ngày nhận phòng</p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-xs font-semibold text-gray-700">Số khách (Tối đa: {room.khach})</label>
                  <div className="flex items-center gap-3 mt-1">
                    <button 
                      onClick={() => setGuests((g) => Math.max(1, g - 1))} 
                      className="w-8 h-8 border rounded-full hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="min-w-[2ch] text-center">{guests}</span>
                    <button 
                      onClick={() => setGuests((g) => Math.min(room.khach, g + 1))} 
                      disabled={guests >= room.khach}
                      className={`w-8 h-8 border rounded-full transition-colors ${
                        guests >= room.khach 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      +
                    </button>
                  </div>
                  {guests > room.khach && (
                    <p className="text-xs text-red-600 mt-1">Số khách vượt quá giới hạn</p>
                  )}
                </div>

                <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>${room.giaTien} x {nights || 0} đêm</span>
                    <span>${nights ? room.giaTien * nights : 0}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng</span>
                    <span>${total}</span>
                  </div>
                </div>

                <button 
                  onClick={handleBook} 
                  disabled={
                    !checkIn || 
                    !checkOut || 
                    (checkIn && new Date(checkIn) < new Date().setHours(0, 0, 0, 0)) ||
                    (checkOut && checkIn && new Date(checkOut) <= new Date(checkIn)) ||
                    guests > room.khach
                  } 
                  className={`w-full mt-4 py-3 rounded-xl text-white font-semibold transition-all ${
                    checkIn && 
                    checkOut && 
                    !(checkIn && new Date(checkIn) < new Date().setHours(0, 0, 0, 0)) &&
                    !(checkOut && checkIn && new Date(checkOut) <= new Date(checkIn)) &&
                    guests <= room.khach
                      ? 'bg-rose-600 hover:bg-rose-700 hover:scale-105' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {!checkIn || !checkOut 
                    ? 'Chọn ngày nhận và trả phòng' 
                    : (checkIn && new Date(checkIn) < new Date().setHours(0, 0, 0, 0))
                    ? 'Ngày nhận phòng không hợp lệ'
                    : (checkOut && checkIn && new Date(checkOut) <= new Date(checkIn))
                    ? 'Ngày trả phòng không hợp lệ'
                    : guests > room.khach
                    ? `Tối đa ${room.khach} khách`
                    : 'Đặt phòng'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

