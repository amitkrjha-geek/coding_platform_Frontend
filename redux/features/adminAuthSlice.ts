// import { loginAdmin } from "@/api/admin/admin";
// import { removeAdminData, removeToken, setAdminData, setToken } from "@/config/token";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";

// interface AuthState {
//   user: any | null;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   loading: false,
//   error: null,
// };

// // Async thunk for login
// export const login = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const data = await loginAdmin(email, password);
//       toast.success('Successfully login!')


//       return data;
//     } catch (error: any) {
      
//       return rejectWithValue(error);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       removeToken()
//       removeAdminData();

//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.admin;
//         state.token = action.payload.token;
//         setToken(action.payload.token)
//         setAdminData(action.payload.admin);
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
