import { API } from "../api";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import auth from "./slices/auth";
import registration from "./slices/registration";
import job from "./slices/job";
import notification from "./slices/notification";
export const store = configureStore({
	reducer: {
		auth,
		registration,
		job,
		notification,
		[API.reducerPath]: API.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(API.middleware),
	devTools: true,
});

type DispatchType = () => typeof store.dispatch;
type SelectorType = TypedUseSelectorHook<ReturnType<typeof store.getState>>;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: DispatchType = useDispatch;
export const useAppSelector: SelectorType = useSelector;
