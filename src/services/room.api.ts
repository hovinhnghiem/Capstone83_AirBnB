import api from "./api";
import type { Room, PaginatedResponse } from "@/interfaces/room.interface";

export type RoomPaginated = PaginatedResponse<Room>;

export const getAllRoomsApi = async (): Promise<Room[]> => {
  try {
    const { data } = await api.get("/phong-thue");
    return data?.content ?? (Array.isArray(data) ? data : []);
  } catch (err: any) {
    console.error(
      "Fetch rooms failed:",
      err.response?.status,
      err.response?.data
    );
    throw err;
  }
};

export const getRoomsPaginatedApi = async (
  pageIndex: number,
  pageSize: number
): Promise<RoomPaginated> => {
  const response = await api.get<RoomPaginated>(
    "/phong-thue/phan-trang-tim-kiem",
    {
      params: { pageIndex, pageSize },
    }
  );
  return response.data;
};

export const updateRoomApi = async (id: number, data: Partial<Room>) => {
  try {
    const response = await api.put(`/phong-thue/${id}`, data);
    return response.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.status, err.response?.data);
    throw err;
  }
};

export const addRoomApi = async (data: Partial<Room>) => {
  try {
    const payload: Room = {
      id: 0,
      tenPhong: data.tenPhong ?? "",
      khach: data.khach ?? 0,
      phongNgu: data.phongNgu ?? 0,
      giuong: data.giuong ?? 0,
      phongTam: data.phongTam ?? 0,
      moTa: data.moTa ?? "",
      giaTien: data.giaTien ?? 0,
      maViTri: data.maViTri ?? 1,
      hinhAnh: data.hinhAnh ?? "",
      wifi: data.wifi ?? true,
      dieuHoa: data.dieuHoa ?? true,
      tivi: data.tivi ?? true,
      bep: data.bep ?? true,
      mayGiat: data.mayGiat ?? true,
      banLa: data.banLa ?? true,
      banUi: data.banUi ?? true,
      hoBoi: data.hoBoi ?? true,
      doXe: data.doXe ?? true,
    };
    const response = await api.post<Room>("/phong-thue", payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (err: any) {
    console.error("🚨 Add room failed:", {
      status: err.response?.status,
      message: err.response?.statusText,
      data: err.response?.data,
      headers: err.config?.headers,
    });
    throw err;
  }
};

// export const uploadRoomImageApi = async (roomId: number, file: File) => {
//   const formData = new FormData();
//   formData.append("formFile", file);
//   formData.append("maPhong", String(roomId));

//   const res = await api.post("/phong-thue/upload-hinh-phong", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };
export const uploadRoomImageApi = async (roomId: number, file: File) => {
  const formData = new FormData();
  formData.append("formFile", file);
  formData.append("maPhong", roomId.toString());

  try {
    const res = await api.post("/phong-thue/upload-hinh-phong", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.error("🚨 Upload image failed:", {
      status: err.response?.status,
      message: err.response?.statusText,
      data: err.response?.data,
    });
    throw err;
  }
};
export const getUsersCountApi = async (): Promise<number> => {
  const res = await api.get("/users");
  return res.data?.content ? res.data.content.length : res.data.length;
};
export const getLocationsCountApi = async (): Promise<number> => {
  const res = await api.get("/vi-tri");
  return res.data?.content ? res.data.content.length : res.data.length;
};
export const getBookingsCountApi = async (): Promise<number> => {
  const res = await api.get("/dat-phong");
  return res.data?.content ? res.data.content.length : res.data.length;
};
