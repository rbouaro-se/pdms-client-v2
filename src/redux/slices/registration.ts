import { createSlice } from "@reduxjs/toolkit";
import {
	ClientInfo,
	// IPayloadBuilder,
	PackerInfo,
	UserRegistration,
} from "../../types/account";

type TSteps = "STEP-1" | "STEP-2" | "STEP-3" | "STEP-4" | "STEP-5";

const initialState: {
	step: TSteps;
	account: UserRegistration;
	packer: PackerInfo;
	client: ClientInfo;
} = {
	step: "STEP-1",
	account: {
		provider: "Local",
		picture: "https://example.com/profile_picture.jpg",
		username: "",
		password: "",
		confirmPassword: "",
		type: "Client",
		googleToken: "",
	},
	client: {
		surname: "",
		othernames: "",
		email: "",
		phone: "",
		latitude: 37.7749,
		longitude: -122.4194,
	},
	packer: {
		surname: "",
		othernames: "",
		businessName: "",
		businessLocation: "",
		businessWebsite: "",
		email: "",
		phone: "",
		latitude: 34.0522,
		longitude: -118.2437,
	},
};

const registrationSlice = createSlice({
	name: "registration",
	initialState,
	reducers: {
		setAccountPayload: (
			state,
			action: {
				payload:  UserRegistration ;
			}
		) => {
			state.account = action.payload;
		},
		setPackerPayload: (
			state,
			action: {
				payload:  PackerInfo ;
			}
		) => {
			state.packer = action.payload;
		},
		setClientPayload: (state, action: { payload:  ClientInfo }) => {
			state.client = action.payload;
		},
		setStep: (state, action: { payload: { step: TSteps } }) => {
			state.step = action.payload.step;
		},
		clearPayload: state => {
			state.account = initialState.account;
			state.packer = initialState.packer;
			state.client = initialState.client;
			state.step = "STEP-1";
		},
	},
});

export const { setClientPayload,setPackerPayload,setAccountPayload, setStep, clearPayload } = registrationSlice.actions;
export default registrationSlice.reducer;
