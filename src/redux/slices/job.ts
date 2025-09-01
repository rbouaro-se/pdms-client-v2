import { createSlice } from "@reduxjs/toolkit";
import { TJobRequest } from "../../types/parcel";

const initialState: {
	client: {
		jobRequests: TJobRequest[];
	};
	jobRequest: TJobRequest | null;
} = {
	client: {
		jobRequests: [],
	},
	jobRequest: null,
};

const jobSlice = createSlice({
	name: "job",
	initialState,
	reducers: {
		setClientJobRequests: (state, action) => {
			state.client.jobRequests = action.payload;
		},
		setSingleJobRequest: (state, action) => {
			state.jobRequest = action.payload;
		},
	},
});

export const { setClientJobRequests, setSingleJobRequest } = jobSlice.actions;
export default jobSlice.reducer;
