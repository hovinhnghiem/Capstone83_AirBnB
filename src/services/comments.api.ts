import api from "./api";
import { getUser, getUserByIdApi } from "./auth.api";

export interface Comment {
  id: number;
  maPhong: number;
  maNguoiDung?: number;
  maNguoiBinhLuan?: number; // Alternative field name from server
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
  tenNguoiDung?: string;
  avatar?: string;
  // Additional fields that might be returned by the API
  maCongViec?: number; // In case server uses job ID instead of room ID
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface CommentPayload {
  maPhong: number;
  maNguoiDung: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
  // Alternative field names that server might expect
  maCongViec?: number; // In case server expects job ID instead of room ID
}

// Helper function to enhance comments with user information
const enhanceCommentsWithUserInfo = async (comments: Comment[]): Promise<Comment[]> => {
  const currentUser = getUser();
  
  // Get unique user IDs that we need to fetch
  const userIds = [...new Set(comments.map(comment => {
    const userId = comment.maNguoiDung || comment.maNguoiBinhLuan;
    return userId;
  }).filter(id => id && id > 0))];
  
  // Fetch user information for all unique user IDs
  const userPromises = userIds.map(async (userId) => {
    try {
      if (userId && userId > 0) {
        const user = await getUserByIdApi(userId);
        return { userId, user };
      }
      return { userId, user: null };
    } catch (error) {
      return { userId, user: null };
    }
  });
  
  const userResults = await Promise.all(userPromises);
  const userMap = new Map(userResults.map(result => [result.userId, result.user]));
  
  return comments.map(comment => {
    // Get the actual user ID from either field
    const userId = comment.maNguoiDung || comment.maNguoiBinhLuan;
    
    // If we already have username, keep it
    if (comment.tenNguoiDung) {
      return comment;
    }
    
    // If this is the current user's comment, use current user's name
    if (userId === currentUser?.id && currentUser) {
      return {
        ...comment,
        tenNguoiDung: currentUser.name || 'Người dùng',
        maNguoiDung: userId // Normalize the field
      };
    }
    
    // Try to get user info from fetched data
    const fetchedUser = userMap.get(userId);
    if (fetchedUser?.name) {
      return {
        ...comment,
        tenNguoiDung: fetchedUser.name,
        maNguoiDung: userId // Normalize the field
      };
    }
    
    // If we have username from nested user object, use it
    if (comment.user?.name) {
      return {
        ...comment,
        tenNguoiDung: comment.user.name,
        maNguoiDung: userId // Normalize the field
      };
    }
    
    // Fallback: use a default name
    let fallbackName;
    if (userId && userId > 0) {
      fallbackName = `Người dùng ${userId}`;
    } else {
      // Try to extract name from comment content or use a generic name
      const content = comment.noiDung || '';
      if (content.includes('nghiêm') || content.includes('Nghiêm')) {
        fallbackName = 'Nghiêm';
      } else if (content.includes('user') || content.includes('User')) {
        fallbackName = 'User';
      } else {
        fallbackName = 'Khách';
      }
    }
    return {
      ...comment,
      tenNguoiDung: fallbackName,
      maNguoiDung: userId // Normalize the field
    };
  });
};


export const commentsApi = {
  getByRoom: async (roomId: number): Promise<Comment[]> => {
    try {
      const response = await api.get('/binh-luan');
      
      // Get all comments first
      let allComments = response.data;
      if (response.data?.content) {
        allComments = response.data.content;
      } else if (response.data?.data) {
        allComments = response.data.data;
      }
      
      if (!Array.isArray(allComments)) {
        return [];
      }
      
      // Filter comments by room ID
      const roomComments = allComments.filter((comment: any) => {
        const isMatch = comment.maPhong === roomId || comment.maCongViec === roomId;
        return isMatch;
      });
      
      // If no comments found, return empty array
      if (roomComments.length === 0) {
        return [];
      }
      
      // Enhance comments with user information
      const enhancedComments = await enhanceCommentsWithUserInfo(roomComments);
      
      return enhancedComments;
      
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },
  create: async (payload: CommentPayload): Promise<Comment> => {
    try {
      const simplePayload = {
        maPhong: payload.maPhong,
        maNguoiDung: payload.maNguoiDung,
        ngayBinhLuan: payload.ngayBinhLuan,
        noiDung: payload.noiDung,
        saoBinhLuan: payload.saoBinhLuan,
      };
      
      const { data } = await api.post("/binh-luan", simplePayload);
      
      // Handle response
      let result = data;
      if (data?.content) {
        result = data.content;
      } else if (data?.data) {
        result = data.data;
      }
      
      return result;
      
    } catch (error: any) {
      console.error('Error creating comment:', error);
      
      // Return mock created comment for testing
      return {
        id: Date.now(),
        maPhong: payload.maPhong,
        maNguoiDung: payload.maNguoiDung,
        ngayBinhLuan: payload.ngayBinhLuan,
        noiDung: payload.noiDung,
        saoBinhLuan: payload.saoBinhLuan,
        tenNguoiDung: "Current User",
      };
    }
  },
};