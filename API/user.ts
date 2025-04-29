import axiosInstance from "@/config/api";

interface UserData {
  clerkId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  username?: string;
  avatar?: string;
}

export const createUser = async (userData: UserData): Promise<any> => {
    try {
        const response = await axiosInstance.post("/user", userData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "User creation failed";
    }
};

export const loginUser = async (email: string): Promise<any> => {
    try {
        const response = await axiosInstance.post("/user/login", { email });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Login failed";
    }
};


export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/user");
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching users failed";
    }
};

export const getUserById = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/user/${userId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching user failed";
    }
};

export const updateUser = async (userId: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/user/${userId}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Updating user failed";
    }
};

export const deleteUser = async (userId: string) => {
    try {
        const response = await axiosInstance.delete(`/user/${userId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Deleting user failed";
    }
};
