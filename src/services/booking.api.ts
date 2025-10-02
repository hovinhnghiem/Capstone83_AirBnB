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
    console.log("Creating booking with payload:", booking);
    const { data } = await api.post("/dat-phong", booking, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Booking creation response:", data);
    
    // Handle different response formats
    if (data?.content) {
      return data.content;
    } else if (data?.data) {
      return data.data;
    } else {
      return data;
    }
  } catch (error: any) {
    console.error("Add booking failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      payload: booking
    });
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
export const getBookingsByUserApi = async (userId: number) => {
  const response = await api.get(`/dat-phong/lay-theo-nguoi-dung/${userId}`);
  return response.data;
};

export interface BookingPayload {
  maPhong: number;
  ngayDen: string; // ISO yyyy-mm-dd
  ngayDi: string; // ISO yyyy-mm-dd
  soLuongKhach: number;
  maNguoiDung: number;
}

export const getBookingsByUserIdApi = async (userId: number): Promise<Booking[]> => {
  try {
    console.log(`Fetching bookings for user ${userId} from API...`);
    const { data } = await api.get(`/dat-phong/lay-theo-nguoi-dung/${userId}`);
    console.log("API response:", data);
    
    // Handle different response formats
    if (data?.content) {
      return Array.isArray(data.content) ? data.content : [];
    } else if (Array.isArray(data)) {
      return data;
    } else if (data?.data) {
      return Array.isArray(data.data) ? data.data : [];
    } else {
      console.warn("Unexpected API response format:", data);
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching user bookings:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      userId
    });
    return [];
  }
};

export const bookingApi = {
  getByRoom: async (roomId: number) => {
    // Depending on backend, adjust the params/path
    return api.get(`/dat-phong`, { params: { maPhong: roomId } });
  },
  create: async (payload: BookingPayload) => {
    return api.post(`/dat-phong`, payload);
  },
  getByUser: async (userId: number) => {
    return getBookingsByUserIdApi(userId);
  },
};
