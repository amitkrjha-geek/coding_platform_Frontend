import { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } from "@/API/coupon";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";

export interface CouponData {
    _id: string;
    code: string;
    category: string;
    discountAmount: string;
    // discountPercent: string;
    // maxCap: string;
    details: string;
    __v?: number;
}

type Status = "idle" | "loading" | "succeeded" | "failed";

interface CouponState {
    coupons: CouponData[];
    loading: boolean;
    error: string | null;
    status: Status;
    couponById: CouponData | null;
    couponByIdLoading: boolean;
    couponByIdError: string | null;
    couponByIdStatus: Status;
}

const initialState: CouponState = {
    coupons: [],
    loading: false,
    error: null,
    status: "idle",
    couponById: null,
    couponByIdLoading: false,
    couponByIdError: null,
    couponByIdStatus: "idle",
};

export const registerCoupon = createAsyncThunk("coupon/register", async (data: any, { rejectWithValue }) => {
    try {
        const response = await createCoupon(data);
        toast.success("Coupon created successfully!");
        return response;
    } catch (error: any) {
        return rejectWithValue(error);
    }
});

export const fetchCoupons = createAsyncThunk("coupon/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await getAllCoupons();
        return response;
    } catch (error: any) {
        return rejectWithValue(error);
    }
});

export const fetchCouponById = createAsyncThunk("coupon/fetchById", async (id: string, { rejectWithValue }) => {
    try {
        const response = await getCouponById(id);
        return response;
    } catch (error: any) {
        return rejectWithValue(error);
    }
});

export const modifyCoupon = createAsyncThunk("coupon/update", async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
        const response = await updateCoupon(id, data);
        toast.success("Coupon updated successfully!");
        return response;
    } catch (error: any) {
        return rejectWithValue(error);
    }
});

export const removeCoupon = createAsyncThunk("coupon/delete", async (id: string, { rejectWithValue }) => {
    try {
        await deleteCoupon(id);
        toast.success("Coupon deleted successfully!");
        return id;
    } catch (error: any) {
        return rejectWithValue(error);
    }
});

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerCoupon.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.coupons.push(action.payload.data);
            })
            .addCase(registerCoupon.rejected, (state, action) => {
                state.loading = false;
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.coupons = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.loading = false;
                state.status = "failed";
                state.error = action.payload as string;
            })

            .addCase(fetchCouponById.pending, (state) => {
                state.couponByIdLoading = true;
                state.couponByIdStatus = "loading";
                state.couponByIdError = null;
            })
            .addCase(fetchCouponById.fulfilled, (state, action) => {
                state.couponByIdLoading = false;
                state.couponByIdStatus = "succeeded";
                state.couponById = action.payload;
            })
            .addCase(fetchCouponById.rejected, (state, action) => {
                state.couponByIdLoading = false;
                state.couponByIdStatus = "failed";
                state.couponByIdError = action.payload as string;
            })

            .addCase(modifyCoupon.pending, (state) => {
                state.couponByIdLoading = true;
                state.couponByIdStatus = "loading";
                state.couponByIdError = null;
            })
            .addCase(modifyCoupon.fulfilled, (state, action) => {
                state.couponByIdLoading = false;
                state.couponByIdStatus = "succeeded";
                state.couponById = action.payload;
                state.coupons = state.coupons.map((coupon) =>
                    coupon._id === action.payload._id ? { ...coupon, ...action.payload } : coupon
                );
            })
            .addCase(modifyCoupon.rejected, (state, action) => {
                state.couponByIdLoading = false;
                state.couponByIdStatus = "failed";
                state.couponByIdError = action.payload as string;
            })

            .addCase(removeCoupon.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(removeCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.coupons = state.coupons.filter((coupon) => coupon._id !== action.payload);
            })
            .addCase(removeCoupon.rejected, (state, action) => {
                state.loading = false;
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export default couponSlice.reducer;