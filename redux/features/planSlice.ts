import { createPlan, deletePlan, getAllPlans, getPlanById, updatePlan } from "@/API/plan";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";

export interface PlanData {
  _id: string;
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  details: string[];
  __v?: number;
}

type Status = "idle" | "loading" | "succeeded" | "failed";

interface PlanState {
  plans: PlanData[];
  loading: boolean;
  error: string | null;
  status: Status;
  planById: PlanData | null;
  planByIdLoading: boolean;
  planByIdError: string | null;
  planByIdStatus: Status;
}

const initialState: PlanState = {
  plans: [],
  loading: false,
  error: null,
  status: "idle",
  planById: null,
  planByIdLoading: false,
  planByIdError: null,
  planByIdStatus: "idle",
};

export const registerPlan = createAsyncThunk("plan/register", async (data: any, { rejectWithValue }) => {
  try {
    const response = await createPlan(data);
    toast.success("Plan created successfully!");
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchPlans = createAsyncThunk("plan/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllPlans();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchPlanById = createAsyncThunk("plan/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await getPlanById(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const modifyPlan = createAsyncThunk("plan/update", async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await updatePlan(id, data);
    toast.success("Plan updated successfully!");
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const removePlan = createAsyncThunk("plan/delete", async (id: string, { rejectWithValue }) => {
  try {
    await deletePlan(id);
    toast.success("Plan deleted successfully!");
    return id;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerPlan.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.plans.push(action.payload.data);
      })
      .addCase(registerPlan.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(fetchPlanById.pending, (state) => {
        state.planByIdLoading = true;
        state.planByIdStatus = "loading";
        state.planByIdError = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.planByIdLoading = false;
        state.planByIdStatus = "succeeded";
        state.planById = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.planByIdLoading = false;
        state.planByIdStatus = "failed";
        state.planByIdError = action.payload as string;
      })

      .addCase(modifyPlan.pending, (state) => {
        state.planByIdLoading = true;
        state.planByIdStatus = "loading";
        state.planByIdError = null;
      })
      .addCase(modifyPlan.fulfilled, (state, action) => {
        state.planByIdLoading = false;
        state.planByIdStatus = "succeeded";
        state.planById = action.payload;
        state.plans = state.plans?.map((plan) =>
          plan._id === action.payload._id ? action.payload : plan
        );
      })
      .addCase(modifyPlan.rejected, (state, action) => {
        state.planByIdLoading = false;
        state.planByIdStatus = "failed";
        state.planByIdError = action.payload as string;
      })

      .addCase(removePlan.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(removePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.plans = state.plans.filter((plan) => plan._id !== action.payload);
      })
      .addCase(removePlan.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default planSlice.reducer;