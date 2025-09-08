import axiosInstance from "@/config/api";

// Get a submission by ID
export const getSubmissionByUserId = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/submissions/user/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching submission failed";
    }
};

// Get submission history for activity graph
export const getSubmissionHistory = async (userId: string, year?: number) => {
    try {
        const params = year ? `?year=${year}` : '';
        const response = await axiosInstance.get(`/submissions/history/${userId}${params}`);
        return response.data;
    } catch (error: any) {
        throw {
            success: false,
            message: error.response?.data?.message || "Failed to fetch submission history",
            error: error.response?.data || error
        };
    }
};