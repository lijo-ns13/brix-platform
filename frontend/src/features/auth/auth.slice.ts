import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of your state
interface AuthState {
  isAuthenticated: boolean;
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  isVerified: boolean;
  isBlocked: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  id: "",
  name: "",
  email: "",
  role: "",
  profileImage: "",
  isVerified: false,
  isBlocked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        email: string;
        role: string;
        profileImage: string;
        isVerified: boolean;
        isBlocked: boolean;
      }>
    ) => {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.profileImage = action.payload.profileImage;
      state.isVerified = action.payload.isVerified;
      state.isBlocked = action.payload.isBlocked;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.id = "";
      state.name = "";
      state.email = "";
      state.role = "";
      state.profileImage = "";
      state.isBlocked = false;
      state.isVerified = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
