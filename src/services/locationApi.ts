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

export const getAllLocationsApi = async (): Promise<Location[]> => {
  const response = await api.get("/vi-tri");
  return response.data.content;
};

export const getPaginatedLocationsApi = async (
  pageIndex: number,
  pageSize: number,
  keyword: string = ""
) => {
  const response = await api.get("/vi-tri/phan-trang-tim-kiem", {
    params: { pageIndex, pageSize, keyword },
  });

  console.log("Location API response:", response.data);
  return response.data;
};

export const getLocationByIdApi = async (id: number): Promise<Location> => {
  const response = await api.get(`/vi-tri/${id}`);
  return response.data.content;
};

export const updateLocationApi = async (
  id: number,
  data: Partial<Location>
) => {
  const res = await api.put(`/vi-tri/${id}`, data);
  return res.data.content;
};

export const deleteLocationApi = async (id: number) => {
  await api.delete(`/vi-tri/${id}`);
};
export const addLocationApi = async (data: any) => {
  const res = await api.post("/vi-tri", data);
  return res.data.content;
};

export const uploadLocationImageApi = async (id: number, formFile: File) => {
  const formData = new FormData();
  formData.append("formFile", formFile);
  const res = await api.post(`/vi-tri/upload-hinh-vitri`, formData, {
    params: { maViTri: id },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.content;
};
