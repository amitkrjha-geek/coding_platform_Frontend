// import adminAuthReducer from "./features/adminAuthSlice";
import userReducer from "./features/userSlice";
import planReducer from "./features/planSlice";
import { configureStore } from "@reduxjs/toolkit";
import couponReducer from "./features/couponSlice";
import challengeReducer from "./features/challengeSlice";

export const store = () => {
  return configureStore({
    reducer: {
      // auth: adminAuthReducer,
      user: userReducer,
      plan: planReducer,
      coupon: couponReducer,
      challenge: challengeReducer,
    },
  })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']