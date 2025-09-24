import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import api from '@/services/api';
import type { Room } from '@/interfaces/room.interface';
import { bookingApi, type BookingPayload } from '@/services/booking.api';
import { useAuthStore } from '@/store/auth.slice';

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
    if (!room || !id || !checkIn || !checkOut) return;
    if (!user) {
      alert('Bạn cần đăng nhập để đặt phòng.');
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth/login?redirect=${redirect}`);
      return;
    }
    const payload: BookingPayload = {
      maPhong: Number(id),
      ngayDen: checkIn,
      ngayDi: checkOut,
      soLuongKhach: guests,
    };
    try {
      await bookingApi.create(payload);
      alert('Đặt phòng thành công!');
      navigate('/rooms');
    } catch (err) {
      console.error(err);
      alert('Đặt phòng thất bại, vui lòng thử lại.');
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-6">Đang tải...</div>;
  if (error) return <div className="max-w-6xl mx-auto p-6 text-red-600">{error}</div>;
  if (!room) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
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

          <div className="border rounded-2xl p-4">
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
        </div>

        {/* Right: Booking Card */}
        <div className="md:col-span-1">
          <div className="border rounded-2xl p-4 sticky top-24">
            <div className="text-2xl font-bold">${room.giaTien} <span className="text-base font-normal text-gray-500">/ đêm</span></div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs font-semibold text-gray-700">Nhận phòng</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Trả phòng</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-semibold text-gray-700">Người lớn</label>
              <div className="flex items-center gap-3 mt-1">
                <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="w-8 h-8 border rounded-full">-</button>
                <span className="min-w-[2ch] text-center">{guests}</span>
                <button onClick={() => setGuests((g) => g + 1)} className="w-8 h-8 border rounded-full">+</button>
              </div>
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

            <button onClick={handleBook} disabled={!checkIn || !checkOut} className={`w-full mt-4 py-3 rounded-xl text-white font-semibold ${checkIn && checkOut ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gray-300 cursor-not-allowed'}`}>
              Đặt phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

