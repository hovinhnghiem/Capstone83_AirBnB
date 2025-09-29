import React, { useEffect, useState } from "react";
import { locationApi } from "@/services/locationApi";
import { useNavigate } from "react-router-dom";

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  hinhAnh: string;
}

export default function Discover() {
  const [locations, setLocations] = useState<Location[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await locationApi.getLocations(1, 8); // lấy 8 địa điểm
        setLocations(res.data.content.data); // tuỳ API trả về mà bạn chỉnh lại
      } catch (error) {
        console.error("Lỗi fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Khám phá những điểm đến gần đây
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            onClick={() => navigate(`/rooms?locationId=${loc.id}`)}
          >
            <img
              src={loc.hinhAnh}
              alt={loc.tenViTri}
              className="w-14 h-14 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{loc.tenViTri}</h3>
              <p className="text-sm text-gray-500">{loc.tinhThanh}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
