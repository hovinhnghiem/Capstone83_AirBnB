import api from "./api";

export interface Comment {
  id: number;
  maPhong: number;
  maNguoiDung: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
  tenNguoiDung?: string;
  avatar?: string;
}

export interface CommentPayload {
  maPhong: number;
  maNguoiDung: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
}

export const commentsApi = {
  getByRoom: async (roomId: number): Promise<Comment[]> => {
    const { data } = await api.get(`/binh-luan/lay-binh-luan-theo-phong/${roomId}`);
    return data?.content || [];
  },
  create: async (payload: CommentPayload): Promise<Comment> => {
    const { data } = await api.post("/binh-luan", payload);
    return data;
  },
};
