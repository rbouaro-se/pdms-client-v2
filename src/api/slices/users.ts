import { Page, Pageable } from '@/types';
import { SystemUser, SystemUserRegistrationRequest, SystemUserUpdateRequest, UserFetchOptions } from '@/types/user';
import { API } from '../index';


export const userApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload: { usernameOrEmail: string; password: string }) => ({
        url: `/api/v1/auth/login`,
        method: 'POST',
        body: payload,
      }),
    }),

    registerSystemUser: builder.mutation<
      SystemUser,
      SystemUserRegistrationRequest
    >({
      query: (payload) => ({
        url: `/api/v1/users`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateSystemUser: builder.mutation<
      SystemUser,
      { userId: string; payload: SystemUserUpdateRequest }
    >({
      query: ({ userId, payload }) => ({
        url: `/api/v1/users/${userId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    getSystemUser: builder.query<SystemUser, string>({
      query: (userId) => `/api/v1/users/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
    }),

    getAllUsers: builder.query<Page<SystemUser>, Pageable>({
      query: (pageable) => ({
        url: `/api/v1/users`,
        params: pageable,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((user) => ({
                type: 'User' as const,
                id: user.id,
              })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    searchUsers: builder.mutation<
      Page<SystemUser>,
      {
        pageable?: Pageable
        search?: string
        filter?: UserFetchOptions
      }
    >({
      query: ({ pageable, search, filter }) => ({
        url: `/api/v1/users/search`,
        method: 'POST',
        params: { ...pageable, search },
        body: { filter },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    reinstateUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/v1/users/reinstate/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Suspend user endpoint
    suspendUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/v1/users/suspend/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Additional endpoints you might want to add:

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/v1/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deactivateUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/v1/users/${userId}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),

    activateUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/v1/users/${userId}/activate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterSystemUserMutation,
  useUpdateSystemUserMutation,
  useGetSystemUserQuery,
  useGetAllUsersQuery,
  useSearchUsersMutation,
  useReinstateUserMutation,
  useSuspendUserMutation,
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
} = userApiSlice