import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";
import type { Room } from "@/interfaces/room.interface";

const RoomsPage = () => {
  const [params] = useSearchParams();
  const locationId = params.get("locationId");
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (locationId) {
      api.get(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`)
        .then(({ data }) => setRooms(data.content || []))
        .catch(console.error);
    }
  }, [locationId]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách phòng</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="border rounded-xl p-4 shadow-sm">
            <img src={room.hinhAnh} alt={room.tenPhong} className="rounded-lg mb-3" />
            <h3 className="font-semibold">{room.tenPhong}</h3>
            <p className="text-gray-600">{room.khach} khách - {room.giuong} giường</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RoomsPage;
