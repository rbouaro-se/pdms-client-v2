import { Page, Pageable } from '@/types';
import { DispatcherResponse, CreateDispatcherRequest, DispatcherFilterOptions } from '@/types/parcel';
import { API } from '../index';
import { Dispatcher } from '@/types/dispatcher';


export const dispatcherApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    createDispatcher: builder.mutation<
      DispatcherResponse,
      CreateDispatcherRequest
    >({
      query: (payload) => ({
        url: '/api/v1/dispatchers',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Dispatcher', id: 'LIST' }],
    }),

    updateDispatcher: builder.mutation<
      DispatcherResponse,
      { dispatcherId: string; payload: CreateDispatcherRequest }
    >({
      query: ({ dispatcherId, payload }) => ({
        url: `/api/v1/dispatchers/${dispatcherId}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { dispatcherId }) => [
        { type: 'Dispatcher', id: dispatcherId },
        { type: 'Dispatcher', id: 'LIST' },
      ],
    }),

    getDispatcher: builder.query<DispatcherResponse, string>({
      query: (dispatcherId) => ({
        url: `/api/v1/dispatchers/${dispatcherId}`,
      }),
      providesTags: (_result, _error, dispatcherId) => [
        { type: 'Dispatcher', id: dispatcherId },
      ],
    }),

    getAllDispatchers: builder.query<Page<DispatcherResponse>, Pageable>({
      query: (pageable) => ({
        url: '/api/v1/dispatchers',
        params: pageable,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((dispatcher) => ({
                type: 'Dispatcher' as const,
                id:
                  (dispatcher as any).dispatcherId ??
                  (dispatcher as any).id ??
                  (dispatcher as any).uuid ??
                  'UNKNOWN_ID',
              })),
              { type: 'Dispatcher' as const, id: 'LIST' },
            ]
          : [{ type: 'Dispatcher' as const, id: 'LIST' }],
    }),

    // Keep search as query so results are cacheable and invalidatable
    searchDispatchers: builder.query<
      Page<Dispatcher>,
      {
        pageable: { size: number; page: number }
        searchTerm?: string
        filterOptions?: DispatcherFilterOptions
      }
    >({
      query: ({ pageable, searchTerm, filterOptions }) => ({
        url: '/api/v1/dispatchers/search',
        method: 'POST',
        params: { ...pageable, searchTerm },
        body: {filter: filterOptions},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((dispatcher) => ({
                type: 'Dispatcher' as const,
                id:
                  (dispatcher as any).dispatcherId ??
                  (dispatcher as any).id ??
                  (dispatcher as any).uuid ??
                  'UNKNOWN_ID',
              })),
              { type: 'Dispatcher' as const, id: 'LIST' },
            ]
          : [{ type: 'Dispatcher' as const, id: 'LIST' }],
    }),

    softDeleteDispatcher: builder.mutation<void, string>({
      query: (dispatcherId) => ({
        url: `/api/v1/dispatchers/${dispatcherId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, dispatcherId) => [
        { type: 'Dispatcher', id: dispatcherId },
        { type: 'Dispatcher', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useCreateDispatcherMutation,
  useUpdateDispatcherMutation,
  useGetDispatcherQuery,
  useGetAllDispatchersQuery,
  useSearchDispatchersQuery,
  useSoftDeleteDispatcherMutation,
} = dispatcherApiSlice