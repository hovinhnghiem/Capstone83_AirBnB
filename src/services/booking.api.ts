import api from "./api";

import type { PaginatedResponse } from "@/interfaces/room.interface";
import type { Booking } from "@/interfaces/booking.interface";

export type BookingPaginated = PaginatedResponse<Booking>;

export const getAllBookingsApi = async (): Promise<Booking[]> => {
  try {
    const { data } = await api.get("/dat-phong");
    return data?.content ?? (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const getBookingByIdApi = async (id: number): Promise<Booking> => {
  const { data } = await api.get(`/dat-phong/${id}`);
  return data;
};

export const addBookingApi = async (
  booking: Partial<Booking>
): Promise<Booking> => {
  try {
    const { data } = await api.post("/dat-phong", booking, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error: any) {
    console.error(" Add booking failed:", error.response?.data || error);
    throw error;
  }
};

export const updateBookingApi = async (
  id: number,
  booking: Partial<Booking>
): Promise<Booking> => {
  try {
    const { data } = await api.put(`/dat-phong/${id}`, booking, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error: any) {
    console.error("Update booking failed:", error.response?.data || error);
    throw error;
  }
};

export const deleteBookingApi = async (id: number): Promise<void> => {
  try {
    await api.delete(`/dat-phong/${id}`);
  } catch (error: any) {
    console.error(" Delete booking failed:", error.response?.data || error);
    throw error;
  }
};

export interface BookingPayload {
  maPhong: number;
  ngayDen: string; // ISO yyyy-mm-dd
  ngayDi: string; // ISO yyyy-mm-dd
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
