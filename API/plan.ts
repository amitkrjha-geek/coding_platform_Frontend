import axiosInstance from "@/config/api";

// Create a plan
export const createPlan = async (data: any) => {
    try {
        const response = await axiosInstance.post("/plans", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Plan creation failed";
    }
};

// Get all plans
export const getAllPlans = async () => {
    try {
        const response = await axiosInstance.get("/plans");
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching plans failed";
    }
};

// Get a plan by ID
export const getPlanById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/plans/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching plan failed";
    }
};

// Update a plan
export const updatePlan = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/plans/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Updating plan failed";
    }
};

// Delete a plan
export const deletePlan = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/plans/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Deleting plan failed";
    }
};
