// api/slices/customerApiSlice.ts
import { CustomerRequest, Page, Pageable } from '@/types';
import { Customer } from '@/types/user';
import { API } from '../index';


export const customerApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Page<Customer>, Pageable>({
      query: (pageable) => ({
        url: '/api/v1/customers',
        params: {
          page: pageable.pageNumber,
          size: pageable.pageSize,
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
          size: pageable.pageSize,
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

    // Add the update customer mutation
    updateCustomer: builder.mutation<
      Customer,
      { customerId: string; payload: CustomerRequest }
    >({
      query: ({ customerId, payload }) => ({
        url: `/api/v1/customers/${customerId}`,
        method: 'PUT',
        body: payload,
      }),
     
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
        'Customer',
      ],

      async onQueryStarted(
        { customerId },
        { dispatch, queryFulfilled }
      ) {
    
        try {
          await queryFulfilled
          
          dispatch(
            customerApiSlice.util.invalidateTags([
              { type: 'Customer', id: customerId },
            ])
          )
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
  }),
})

export const {
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useSearchCustomersMutation,
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} = customerApiSlice;