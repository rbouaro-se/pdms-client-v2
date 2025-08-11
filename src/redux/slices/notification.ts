
import { TAlert, TFeedback } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
	alert: Omit<TAlert, "icon"> | null;
	feedback: Omit<TFeedback, "icon"> | null;
} = {
	alert: null,
	feedback: null,
};

const notificationSlice = createSlice({
	name: "alert",
	initialState,
	reducers: {
		setAlert: (state, action: { payload: Omit<TAlert, "icon"> }) => {
			state.alert = action.payload;
		},
		clearAlert: state => {
			state.alert = null;
		},

		setFeedback: (state, action: { payload: Omit<TFeedback, "icon"> }) => {
			state.feedback = action.payload;
		},
		clearFeedback: state => {
			state.feedback = null;
		},
	},
});

export const { setAlert, clearAlert, setFeedback, clearFeedback } =
	notificationSlice.actions;
export default notificationSlice.reducer;
