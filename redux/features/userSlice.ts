import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "@/API/user";
import { User } from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  status: Status;
  userById: User | null;
  userByIdLoading: boolean;
  userByIdError: string | null;
  userByIdStatus: Status;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  status: "idle",
  userById: null,
  userByIdLoading: false,
  userByIdError: null,
  userByIdStatus: "idle",
};

// Async thunk for creating a user
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      const data = await createUser(userData);
      toast.success("User registered successfully!");
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk("user/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const data = await getAllUsers();
    return data;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

// Async thunk for fetching a user by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await getUserById(userId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for updating a user
export const modifyUser = createAsyncThunk(
  "user/update",
  async ({ userId, userData }: { userId: string; userData: any }, { rejectWithValue }) => {
    try {
      const data = await updateUser(userId, userData);
      toast.success("User updated successfully!");
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for deleting a user
export const removeUser = createAsyncThunk("user/delete", async (userId: string, { rejectWithValue }) => {
  try {
    await deleteUser(userId);
    toast.success("User deleted successfully!");
    return userId;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.users.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch All Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.userByIdLoading = true;
        state.userByIdStatus = "loading";
        state.userByIdError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.userByIdLoading = false;
        state.userByIdStatus = "succeeded";
        state.userById = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.userByIdLoading = false;
        state.userByIdStatus = "failed";
        state.userByIdError = action.payload as string;
      })

      // Modify User
      .addCase(modifyUser.pending, (state) => {
        state.userByIdLoading = true;
        state.userByIdStatus = "loading";
        state.userByIdError = null;
      })
      .addCase(modifyUser.fulfilled, (state, action) => {
        state.userByIdLoading = false;
        state.userByIdStatus = "succeeded";
        state.userById = action.payload;
        state.users = state.users?.map((user) =>
          user._id?.toString() === action.payload._id?.toString() ? action.payload : user
        );
      })
      .addCase(modifyUser.rejected, (state, action) => {
        state.userByIdLoading = false;
        state.userByIdStatus = "failed";
        state.userByIdError = action.payload as string;
      })

      // Remove User
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;