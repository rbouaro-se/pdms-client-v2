import { Page, Pageable } from '@/types';
import { Branch, BranchFetchOptions, CreateBranchRequest } from '@/types/parcel';
import { API } from '../index';


export const branchApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    createBranch: builder.mutation<Branch, CreateBranchRequest>({
      query: (payload) => ({
        url: '/api/v1/branches',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Branch', id: 'LIST' }],
    }),

    getAllBranches: builder.query<Page<Branch>, { size: number; page: number }>(
      {
        query: (pageable: { size: number; page: number }) => ({
          url: '/api/v1/branches',
          params: pageable,
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.content.map((branch) => ({
                  type: 'Branch' as const,
                  id: (branch as any).branchId ?? (branch as any).id,
                })),
                { type: 'Branch' as const, id: 'LIST' },
              ]
            : [{ type: 'Branch' as const, id: 'LIST' }],
      }
    ),

    searchBranches: builder.query<
      Page<Branch>,
      {
        pageable: Pageable
        search?: string
        filter?: BranchFetchOptions
      }
    >({
      query: ({ pageable, search, filter }) => ({
        url: '/api/v1/branches/search',
        method: 'POST',
        params: { ...pageable, search },
        body: filter,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((branch) => ({
                type: 'Branch' as const,
                id: (branch as any).branchId ?? (branch as any).id,
              })),
              { type: 'Branch' as const, id: 'LIST' },
            ]
          : [{ type: 'Branch' as const, id: 'LIST' }],
    }),

    getBranchById: builder.query<Branch, string>({
      query: (branchId) => `/api/v1/branches/${branchId}`,
      providesTags: (_result, _error, branchId) => [
        { type: 'Branch', id: branchId },
      ],
    }),

    deleteBranch: builder.mutation<void, string>({
      query: (branchId) => ({
        url: `/api/v1/branches/${branchId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, branchId) => [
        { type: 'Branch', id: branchId },
        { type: 'Branch', id: 'LIST' },
      ],
    }),

    // Archive (deactivate) a branch
    archiveBranch: builder.mutation<void, string>({
      query: (branchId) => ({
        url: `/api/v1/branches/${branchId}/archive`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, branchId) => [
        { type: 'Branch', id: branchId },
        { type: 'Branch', id: 'LIST' },
      ],
    }),

    // Unarchive (reactivate) a branch
    unarchiveBranch: builder.mutation<void, string>({
      query: (branchId) => ({
        url: `/api/v1/branches/${branchId}/unarchive`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, branchId) => [
        { type: 'Branch', id: branchId },
        { type: 'Branch', id: 'LIST' },
      ],
    }),

    updateBranch: builder.mutation<
      Branch,
      { branchId: string; payload: CreateBranchRequest }
    >({
      query: ({ branchId, payload }) => ({
        url: `/api/v1/branches/${branchId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { branchId }) => [
        { type: 'Branch', id: branchId },
        { type: 'Branch', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useCreateBranchMutation,
  useGetAllBranchesQuery,
  useSearchBranchesQuery,
  useGetBranchByIdQuery,
  useDeleteBranchMutation,
  useArchiveBranchMutation,
  useUnarchiveBranchMutation,
  useUpdateBranchMutation,
} = branchApiSlice