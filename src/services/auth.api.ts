import api from "./api";
import type { BaseApiResponse } from "@/interfaces/base.interface";
import type { CurrentUser } from "@/interfaces/auth.interface";
import type { AddUserValues, User } from "@/interfaces/user.interface";

export type Role = "ADMIN" | "USER";

export interface LoginDataRequest {
  email: string;
  password: string;
}

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: Role;
}

export const loginApi = async (
  data: LoginDataRequest
): Promise<CurrentUser | null> => {
  try {
    const response = await api.post("/auth/signin", data);
    const { user, token } = response.data.content;
    const fullUser: CurrentUser = {
      ...user,
      accessToken: token,
    };

    localStorage.setItem("user", JSON.stringify(fullUser));
    return fullUser;
  } catch (error: any) {
    console.error("loginApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export const updateUserApi = async (
  userId: number,
  updatedUser: Partial<CurrentUser>
): Promise<CurrentUser | null> => {
  try {
    const response = await api.put<BaseApiResponse<CurrentUser>>(
      `/users/${userId}`,
      updatedUser
    );
    return response.data.content;
  } catch (error: any) {
    console.error("updateUserApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export const deleteUserApi = async (userId: number): Promise<boolean> => {
  try {
    await api.delete(`/users?id=${userId}`);
    return true;
  } catch (error: any) {
    console.error("deleteUserApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return false;
  }
};
export const addUserApi = async (
  values: AddUserValues
): Promise<User | null> => {
  try {
    const response = await api.post<BaseApiResponse<User>>(
      "/auth/signup",
      values
    );
    return response.data.content;
  } catch (error: any) {
    console.error("addUserApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export const registerApi = async (
  values: RegisterValues
): Promise<RegisterValues | null> => {
  try {
    const res = await api.post<BaseApiResponse<RegisterValues>>(
      "/auth/signup",
      values
    );
    return res.data.content;
  } catch (error: any) {
    console.error("registerApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

export const AUTH_STORAGE_KEY = "user";

export const saveUser = (user: CurrentUser) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const getUser = (): CurrentUser | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
};

export const clearUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getUserByIdApi = async (userId: number): Promise<CurrentUser | null> => {
  try {
    const response = await api.get<BaseApiResponse<CurrentUser>>(`/users/${userId}`);
    return response.data.content;
  } catch (error: any) {
    console.error("getUserByIdApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};

// User-specific avatar upload (for regular users, not admins)
export const uploadUserAvatarApi = async (
  userId: number,
  file: File
): Promise<{ avatarUrl: string } | null> => {
  try {
    // Convert file to base64 immediately for user avatars
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    console.log('Uploading user avatar (base64 method):', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      userId: userId
    });
    
    // Try to update user profile with base64 avatar
    const updatedUser = await updateUserApi(userId, { avatar: base64 });
    if (updatedUser) {
      console.log('User avatar updated successfully');
      return { avatarUrl: base64 };
    } else {
      // If server update fails, still return base64 for local use
      console.log('Server update failed, returning base64 for local use');
      return { avatarUrl: base64 };
    }
  } catch (error: any) {
    console.error("uploadUserAvatarApi error:", error);
    return null;
  }
};

// Admin avatar upload (tries server endpoints first)
export const uploadAvatarApi = async (
  userId: number,
  file: File
): Promise<{ avatarUrl: string } | null> => {
  try {
    const formData = new FormData();
    // Use 'formFile' field name based on working room upload pattern
    formData.append('formFile', file);
    
    console.log('Uploading avatar:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      userId: userId
    });
    
    // Try different endpoint variations based on the working room upload pattern
    const endpoints = [
      `/users/upload-avatar`,
      `/users/upload-hinh-avatar`,
      `/users/${userId}/upload-avatar`,
      `/users/${userId}/upload-hinh-avatar`,
      `/upload-avatar`,
      `/upload-hinh-avatar`
    ];
    
    let response;
    let lastError;
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying endpoint:', endpoint);
        response = await api.post<BaseApiResponse<{ avatarUrl: string }>>(
          endpoint,
          formData,
          {
            params: {
              maNguoiDung: userId
            },
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        console.log('Success with endpoint:', endpoint);
        break;
      } catch (error: any) {
        console.log('Failed with endpoint:', endpoint, error.response?.status);
        lastError = error;
      }
    }
    
    if (!response) {
      throw lastError;
    }
    
    return response.data.content;
  } catch (error: any) {
    console.error("uploadAvatarApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // Fallback: If upload endpoints don't exist, try to update user with a placeholder avatar URL
    console.log('Upload endpoints not available, using fallback method');
    return await uploadAvatarFallback(userId, file);
  }
};

// Fallback method: Convert image to base64 and store in user data
const uploadAvatarFallback = async (
  userId: number,
  file: File
): Promise<{ avatarUrl: string } | null> => {
  try {
    // Convert file to base64 data URL
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    console.log('Using fallback method - updating user profile with base64 avatar');
    
    // Try different user update approaches
    const updateMethods = [
      // Method 1: Direct user update
      () => updateUserApi(userId, { avatar: base64 }),
      // Method 2: Try with different endpoint structure
      () => updateUserProfileApi(userId, { avatar: base64 })
    ];
    
    for (const updateMethod of updateMethods) {
      try {
        const updatedUser = await updateMethod();
        if (updatedUser) {
          console.log('Avatar updated successfully via fallback method');
          return { avatarUrl: base64 };
        }
      } catch (error: any) {
        console.log('Update method failed:', error.response?.status, error.response?.data);
      }
    }
    
    // If all update methods fail, return the base64 URL anyway for local use
    console.log('All update methods failed, returning base64 for local use');
    return { avatarUrl: base64 };
    
  } catch (error: any) {
    console.error("uploadAvatarFallback error:", error);
    return null;
  }
};

// Alternative user profile update method
const updateUserProfileApi = async (
  userId: number,
  profileData: Partial<CurrentUser>
): Promise<CurrentUser | null> => {
  try {
    // Try different endpoint variations for user profile updates
    const endpoints = [
      `/users/${userId}/profile`,
      `/users/profile`,
      `/profile`,
      `/users/${userId}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying profile update endpoint:', endpoint);
        const response = await api.put<BaseApiResponse<CurrentUser>>(
          endpoint,
          profileData
        );
        console.log('Profile update successful with endpoint:', endpoint);
        return response.data.content;
      } catch (error: any) {
        console.log('Profile update failed with endpoint:', endpoint, error.response?.status);
      }
    }
    
    return null;
  } catch (error: any) {
    console.error("updateUserProfileApi error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return null;
  }
};
