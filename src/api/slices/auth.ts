import { clearUser, setUser } from "../../redux/slices/auth";
import { UserRegistration } from "../../types/account";
import { API } from "../index";


export const authApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload: { usernameOrEmail: string; password: string }) => ({
        url: `/api/v1/auth/login`,
        method: 'POST',
        body: payload,
      }),
    }),
    initiatePhoneLogin: builder.mutation({
      query: (payload: { phoneNumber: string }) => ({
        url: `/api/v1/auth/initiate-phone-login`,
        method: 'POST',
        body: payload,
      }),
    }),

    phoneLogin: builder.mutation({
      query: (payload: { phoneNumber: string; otp: string }) => ({
        url: `/api/v1/auth/phone-login`,
        method: 'POST',
        body: payload,
      }),
    }),
    register: builder.mutation({
      query: (payload: UserRegistration) => ({
        url: `account/register`,
        method: 'POST',
        body: payload,
      }),
    }),

    requestAccountVerification: builder.mutation({
      query: (payload: { field: string }) => ({
        url: `auth/request-account-verification`,
        method: 'PATCH',
        body: payload,
      }),
    }),
    requestAccountReset: builder.mutation({
      query: (payload: { email: string }) => ({
        url: `auth/request-password-reset`,
        method: 'PATCH',
        body: payload,
      }),
    }),
    changeAccountPassword: builder.mutation({
      query: (payload: { password: string; confirmPassword: string }) => ({
        url: `auth/change-password`,
        method: 'PATCH',
        body: payload,
      }),
    }),
    confirmAccountReset: builder.mutation({
      query: (payload: { code: string }) => ({
        url: `auth/confirm-password-reset`,
        method: 'PATCH',
        body: payload,
      }),
    }),

    verifyAccount: builder.mutation({
      query: (payload: { field: string; code: string }) => ({
        url: `auth/verify-account`,
        method: 'PATCH',
        body: payload,
      }),
    }),

    loginWithGoogle: builder.mutation({
      query: (payload: { token: string }) => ({
        url: `auth/login-with-google`,
        method: 'POST',
        body: payload,
      }),
    }),

    registerWithGoogle: builder.mutation({
      query: (payload: { token: string }) => ({
        url: `auth/login-with-google`,
        method: 'POST',
        body: payload,
      }),
    }),

    stripeOnboarding: builder.mutation({
      query: () => ({
        url: `stripe/account-onboarding-session`,
        method: 'POST',
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/v1/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(clearUser())
          setTimeout(() => {
            dispatch(API.util.resetApiState())
          }, 1000)
        } catch (err) {
          console.log(err)
        }
      },
    }),
    changePassword: builder.mutation<
      void,
      {
        currentPassword: string
        newPassword: string
        confirmPassword: string
      }
    >({
      query: (payload) => ({
        url: `/api/v1/auth/change-password`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],
    }),

    systemUserProfile: builder.mutation({
      query: () => ({
        url: '/api/v1/auth/profile',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: resData } = await queryFulfilled

          if (resData && 'email' in resData) {
            dispatch(setUser({ type: 'system', ...resData }))
          }

          if (resData && 'phoneNumber' in resData) {
            dispatch(setUser({ type: 'customer', ...resData }))
          }

          // dispatch(setUser(resData));
        } catch (err) {
          console.log(err)
          dispatch(clearUser())
          // window.location.href = "http://localhost:5173/server-error"
        }
      },
    }),
  }),
})

export const {
	useLoginMutation,
	useInitiatePhoneLoginMutation,
	usePhoneLoginMutation,
	useLoginWithGoogleMutation,
	useSystemUserProfileMutation,
	useLogoutMutation,
	useRegisterMutation,
	useRequestAccountVerificationMutation,
	useVerifyAccountMutation,
	useStripeOnboardingMutation,
	useRequestAccountResetMutation,
	useConfirmAccountResetMutation,
	useChangeAccountPasswordMutation,
	useChangePasswordMutation
} = authApiSlice;