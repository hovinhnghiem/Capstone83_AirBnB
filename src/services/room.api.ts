import api from "./api";
import type {
  Room,
  PaginatedResponse,
  ApiResponse,
} from "@/interfaces/room.interface";

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

export const getRoomByIdApi = async (id: number): Promise<Room> => {
  const { data } = await api.get(`/phong-thue/${id}`);
  return data?.content ?? data;
};

export const updateRoomApi = async (id: number, patch: Partial<Room>) => {
  try {
    const current = await getRoomByIdApi(id);
    const payload: Room = {
      id,
      tenPhong: patch.tenPhong ?? current.tenPhong ?? "",
      khach: patch.khach ?? current.khach ?? 0,
      phongNgu: patch.phongNgu ?? current.phongNgu ?? 0,
      giuong: patch.giuong ?? current.giuong ?? 0,
      phongTam: patch.phongTam ?? current.phongTam ?? 0,
      moTa: patch.moTa ?? current.moTa ?? "",
      giaTien: patch.giaTien ?? current.giaTien ?? 0,
      maViTri: patch.maViTri ?? current.maViTri ?? 1,
      hinhAnh: patch.hinhAnh ?? current.hinhAnh ?? "",
      wifi: patch.wifi ?? current.wifi ?? false,
      dieuHoa: patch.dieuHoa ?? current.dieuHoa ?? false,
      tivi: patch.tivi ?? current.tivi ?? false,
      bep: patch.bep ?? current.bep ?? false,
      mayGiat: patch.mayGiat ?? current.mayGiat ?? false,
      banLa: patch.banLa ?? current.banLa ?? false,
      banUi: patch.banUi ?? current.banUi ?? false,
      hoBoi: patch.hoBoi ?? current.hoBoi ?? false,
      doXe: patch.doXe ?? current.doXe ?? false,
    };

    const res = await api.put(`/phong-thue/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err: any) {
    console.error(" Update failed:", {
      status: err.response?.status,
      data: err.response?.data,
      payload: patch,
    });
    throw err;
  }
};

export const deleteRoomApi = async (id: number) => {
  try {
    const res = await api.delete(`/phong-thue/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Delete failed:", {
      status: err.response?.status,
      data: err.response?.data,
    });
    throw err;
  }
};

export const addRoomApi = async (data: Partial<Room>) => {
  try {
    const payload: Room = {
      id: 0,
      tenPhong: data.tenPhong ?? "Untitled Room",
      khach: data.khach ?? 1,
      phongNgu: data.phongNgu ?? 1,
      giuong: data.giuong ?? 1,
      phongTam: data.phongTam ?? 1,
      moTa: data.moTa ?? "",
      giaTien: data.giaTien ?? 0,
      maViTri: data.maViTri && data.maViTri > 0 ? data.maViTri : 1,
      hinhAnh: data.hinhAnh ?? "",
      wifi: data.wifi ?? false,
      dieuHoa: data.dieuHoa ?? false,
      tivi: data.tivi ?? false,
      bep: data.bep ?? false,
      mayGiat: data.mayGiat ?? false,
      banLa: data.banLa ?? false,
      banUi: data.banUi ?? false,
      hoBoi: data.hoBoi ?? false,
      doXe: data.doXe ?? false,
    };

    const response = await api.post<ApiResponse<Room>>("/phong-thue", payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data.content;
  } catch (err: any) {
    console.error(" Add room failed:", {
      status: err.response?.status,
      data: err.response?.data,
      payload: data,
    });
    throw err;
  }
};

export const uploadRoomImageApi = async (roomId: number, file: File) => {
  const formData = new FormData();
  console.log("roomId:", roomId);

  formData.append("formFile", file);

  try {
    const res = await api.post(`/phong-thue/upload-hinh-phong`, formData, {
      params: { maPhong: roomId },
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    console.error(" Upload image failed:", {
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
