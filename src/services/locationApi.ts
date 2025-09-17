import api from "@/services/api";

export interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
  data: Location[];
}

export interface ApiResponse {
  content: Location[];
  totalPages: number;
  pageIndex: number;
}

export const locationApi = {
  getLocations: (pageIndex = 1, pageSize = 6) =>
    api.get<ApiResponse>(`/vi-tri/phan-trang-tim-kiem`, {
      params: {
        pageIndex,
        pageSize,
      },
    }),
};
