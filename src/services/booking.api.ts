import api from "./api";

export interface BookingPayload {
  maPhong: number;
  ngayDen: string; // ISO yyyy-mm-dd
  ngayDi: string;  // ISO yyyy-mm-dd
  soLuongKhach: number;
}

export const bookingApi = {
  getByRoom: async (roomId: number) => {
    // Depending on backend, adjust the params/path
    return api.get(`/dat-phong`, { params: { maPhong: roomId } });
  },
  create: async (payload: BookingPayload) => {
    return api.post(`/dat-phong`, payload);
  },
};


