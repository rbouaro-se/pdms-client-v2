import { AppUser } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";


const initialState: {
  user: AppUser | null
  isLoading: boolean
  passwordReset: {
    mustConfirm: boolean
    expiresAt: Date
  } | null
} = {
  user: null,
  isLoading: true,
  passwordReset: localStorage.getItem('passwordReset')
    ? JSON.parse(localStorage.getItem('passwordReset') || '')
    : null,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setPassworResetStatus: (
			state,
			action: { payload: { expiresAt: Date } }
		) => {
			state.passwordReset = {
				mustConfirm: true,
				expiresAt: action.payload.expiresAt,
			};
			localStorage.setItem(
				"passwordReset",
				JSON.stringify(state.passwordReset)
			);
		},
		clearPassworResetStatus: state => {
			state.passwordReset = null;
			localStorage.removeItem("passwordReset");
		},
		clearUser: state => {
			state.user = null;
		},
	},
});

export const {
	setUser,
	clearUser,
	setPassworResetStatus,
	clearPassworResetStatus,
} = authSlice.actions;
export default authSlice.reducer;