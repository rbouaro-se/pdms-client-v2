import { AppUser, Customer, SystemUser } from '@/types/user';
import { clearUser, setUser } from '../../redux/slices/auth';
import { API } from '../index';


// Request types based on your backend DTOs
interface LoginRequest {
  usernameOrEmail: string
  password: string
}

interface InitializePhoneLoginRequest {
  phoneNumber: string
}

interface PhoneLoginRequest {
  phoneNumber: string
  otp: string
}

interface InitiatePasswordResetRequest {
  email: string
}

interface ConfirmPasswordResetRequest {
  otp: string
}

interface PasswordResetRequest {
  newPassword: string
  confirmPassword: string
}

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface GeneralMessage {
  message: string
}

export const authApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<SystemUser, LoginRequest>({
      query: (payload) => ({
        url: `/api/v1/auth/login`,
        method: 'POST',
        body: payload,
      }),
    }),

    initiatePhoneLogin: builder.mutation<
      GeneralMessage,
      InitializePhoneLoginRequest
    >({
      query: (payload) => ({
        url: `/api/v1/auth/initiate-phone-login`,
        method: 'POST',
        body: payload,
      }),
    }),

    phoneLogin: builder.mutation<Customer, PhoneLoginRequest>({
      query: (payload) => ({
        url: `/api/v1/auth/phone-login`,
        method: 'POST',
        body: payload,
      }),
    }),

    initiatePasswordReset: builder.mutation<
      GeneralMessage,
      InitiatePasswordResetRequest
    >({
      query: (payload) => ({
        url: `/api/v1/auth/initiate-password-reset`,
        method: 'POST',
        body: payload,
      }),
    }),

    confirmPasswordReset: builder.mutation<
      GeneralMessage,
      ConfirmPasswordResetRequest
    >({
      query: (payload) => ({
        url: `/api/v1/auth/confirm-password-reset`,
        method: 'POST',
        body: payload,
      }),
    }),

    resetPassword: builder.mutation<
      GeneralMessage,
      PasswordResetRequest
    >({
      query: (payload) => ({
        url: `/api/v1/auth/reset-password`,
        method: 'POST',
        body: payload,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (payload) => ({
        url: `/api/v1/auth/change-password`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
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

    systemUserProfile: builder.mutation<AppUser, void>({
      query: () => ({
        url: '/api/v1/auth/profile',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: resData } = await queryFulfilled

          if (resData && 'email' in resData) {
            dispatch(setUser({ ...resData, type: 'system' }))
          }

          if (resData && 'phoneNumber' in resData) {
            dispatch(setUser({ ...resData, type: 'customer' }))
          }
        } catch (err) {
          console.log(err)
          dispatch(clearUser())
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useInitiatePhoneLoginMutation,
  usePhoneLoginMutation,
  useInitiatePasswordResetMutation,
  useConfirmPasswordResetMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useSystemUserProfileMutation,
  useLogoutMutation,
} = authApiSlice