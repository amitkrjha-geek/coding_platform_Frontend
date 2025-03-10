import axiosInstance from "../config/api";

// Create a coupon
export const createCoupon = async (data: any) => {
    try {
        const response = await axiosInstance.post("/coupons", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Coupon creation failed";
    }
};

// Get all coupons
export const getAllCoupons = async () => {
    try {
        const response = await axiosInstance.get("/coupons");
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching coupons failed";
    }
};

// Get a coupon by ID
export const getCouponById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/coupons/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching coupon failed";
    }
};

// Update a coupon
export const updateCoupon = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/coupons/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Updating coupon failed";
    }
};

// Delete a coupon
export const deleteCoupon = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/coupons/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Deleting coupon failed";
    }
};
