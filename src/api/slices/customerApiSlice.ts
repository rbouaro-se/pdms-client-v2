// api/slices/customerApiSlice.ts
import { Customer } from '@/types/user'
import { API } from '../index'
import { Page, Pageable } from '@/types'

export const customerApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Page<Customer>, Pageable>({
      query: (pageable) => ({
        url: '/api/v1/customers',
        params: {
          page: pageable.pageNumber,
          size: pageable.pageSize
        },
      }),
      providesTags: ['Customer'],
    }),

    searchCustomers: builder.mutation<
      Page<Customer>,
      {
        pageable: Pageable
        searchTerm?: string
      }
    >({
      query: ({ pageable, searchTerm }) => ({
        url: '/api/v1/customers/search',
        method: 'POST',
        params: {
          page: pageable.pageNumber,
          size: pageable.pageSize
        },
        body: { searchTerm },
      }),
    }),

    getCustomerById: builder.query<Customer, string>({
      query: (customerId) => `/api/v1/customers/${customerId}`,
      providesTags: (_result, _error, customerId) => [
        { type: 'Customer', id: customerId },
      ],
    }),
  }),
})

export const {
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useSearchCustomersMutation,
  useGetCustomerByIdQuery,
} = customerApiSlice
