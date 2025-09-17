import { id } from "zod/v4/locales";
import api from "./api";
import type { Room, PaginatedResponse } from "@/interfaces/room.interface";

export type RoomPaginated = PaginatedResponse<Room>;

export const getAllRoomsApi = async (): Promise<Room[]> => {
  const res = await api.get("/phong-thue");
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (res.data?.content && Array.isArray(res.data.content)) {
    return res.data.content;
  }
  return [];
};

export const getRoomsPaginatedApi = async (
  pageIndex: number,
  pageSize: number
): Promise<RoomPaginated> => {
  const res = await api.get<RoomPaginated>("/phong-thue/phan-trang-tim-kiem", {
    params: { pageIndex, pageSize },
  });
  return res.data;
};

export const updateRoomApi = async (id: number, data: Partial<Room>) => {
  console.log("Updating room:", id, data);
  const res = await api.put<Room>(`/phong-thue/${id}`, data);
  return res.data;
};
