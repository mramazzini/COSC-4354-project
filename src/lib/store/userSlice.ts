import { User, UserRole } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  data: User;
  initialized: boolean;
  dirty: boolean; // indicates if the user has unsaved changes
}

const initialState: UserState = {
  data: {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    addressOne: "",
    addressTwo: "",
    password: "",
    city: "",
    state: "",
    zipCode: "",
    skills: [],
    preferences: "",
    availability: [],
    role: UserRole.Volunteer,
  },
  initialized: false,
  dirty: false,
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.data = action.payload;
      state.initialized = true;
      state.dirty = false;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      state.data = { ...state.data, ...action.payload };
      state.dirty = true;
    },
    clearUser(state) {
      state.data = initialState.data;
      state.initialized = false;
      state.dirty = false;
    },
    markClean(state) {
      state.dirty = false;
    },
  },
});

export const { setUser, updateUser, clearUser, markClean } =
  userReducer.actions;

export default userReducer.reducer;
