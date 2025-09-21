import axiosInstance from "@/config/api";

// Create a challenge
export const createChallenge = async (data: any) => {
    try {
        const response = await axiosInstance.post("/challenges", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Challenge creation failed";
    }
};

// Get all challenges
export const getAllChallenges = async () => {
    
    try {
        const response = await axiosInstance.get("/challenges");
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching challenges failed";
    }
};

// Get a challenge by ID
export const getChallengeById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/challenges/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching challenge failed";
    }
};

// Update a challenge
export const updateChallenge = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/challenges/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Updating challenge failed";
    }
};

// Delete a challenge
export const deleteChallenge = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/challenges/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Deleting challenge failed";
    }
};