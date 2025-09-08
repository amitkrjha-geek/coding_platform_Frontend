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

// Get paginated submissions by user ID
export const getPaginatedSubmissions = async (
    userId: string, 
    page: number = 1, 
    limit: number = 10,
    filters?: {
        status?: string;
        language?: string;
        challengeId?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(filters?.status && { status: filters.status }),
            ...(filters?.language && { language: filters.language }),
            ...(filters?.challengeId && { challengeId: filters.challengeId }),
            ...(filters?.sortBy && { sortBy: filters.sortBy }),
            ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
        });

        const response = await axiosInstance.get(`/submissions/user/${userId}/paginated?${params}`);
        return response.data;
    } catch (error: any) {
        throw {
            success: false,
            message: error.response?.data?.message || "Failed to fetch paginated submissions",
            error: error.response?.data || error
        };
    }
};