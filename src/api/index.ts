import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser } from "../redux/slices/auth";
import { IAPIResponse } from "../types";


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({
	baseUrl: apiBaseUrl,
	credentials: "include",

});

const baseQueryWithReauth = async (
	args: string | FetchArgs,
	api: BaseQueryApi,
	extraOptions: object
) => {
	// console.log(args) // request url, method, body
	// console.log(api) // signal, dispatch, getState()
	// console.log(extraOptions) //custom like {shout: true}

	console.log(apiBaseUrl)

  const result = await baseQuery(args, api, extraOptions)

	if (result?.error) {
		const err = result.error as { status: number; data: IAPIResponse<never> };

		if (err.status === 403 || err.status === 401) {
			// if the user is unauthorized, clear the user
			api.dispatch(clearUser());

			if (
				window.location.href.startsWith(apiBaseUrl + "/pages/")
			) {
				window.location.href = "/authentication/login";
			}
		}
	}

	return result;
};

export const API = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: [],
	endpoints: () => ({}),
});