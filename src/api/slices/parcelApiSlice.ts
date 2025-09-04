import { Page } from '@/types';
import { CreateParcelRequest, Parcel, ParcelFetchOptions, ParcelStatusChangeRequest, ParcelStatusChangeResponse, ParcelTrackingResponse } from '@/types/parcel';
import { API } from '../index';


export const parcelApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    createParcel: builder.mutation<Parcel, CreateParcelRequest>({
      query: (payload) => ({
        url: `/api/v1/parcels`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Parcel'],
    }),

    downloadParcelReceipt: builder.mutation<Blob, string>({
      query: (parcelId) => ({
        url: `/api/v1/parcels/receipt/${parcelId}`,
        method: 'GET',
        responseHandler: async (response) => response.blob(),
        cache: 'no-cache',
      }),
    }),

    changeParcelStatus: builder.mutation<
      ParcelStatusChangeResponse,
      { parcelId: string; payload: ParcelStatusChangeRequest }
    >({
      query: ({ parcelId, payload }) => ({
        url: `/api/v1/parcels/${parcelId}/status`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Parcel'],
    }),

    getParcelTrackingInfo: builder.query<ParcelTrackingResponse, string>({
      query: (parcelId) => `/api/v1/parcels/tracking/${parcelId}`,
      providesTags: ['Parcel'],
    }),

    searchParcels: builder.query<
      Page<Parcel>,
      { pageable: {page:number, size:number, sort?:string}; search?: string; filter?: ParcelFetchOptions }
    >({
      query: ({ pageable, search, filter }) => ({
        url: `/api/v1/parcels/search`,
        method: 'POST',
        params: { ...pageable, search },
        body: {filter},
      }),
      providesTags: ['Parcel'],
      transformResponse: (response: Page<Parcel>) => {
        return {
          ...response,
          content: response.content.map((parcel) => ({
            ...parcel,
            _tag: { type: 'Parcel', id: parcel.parcelId },
          })),
        }
      },
    }),

    softDeleteParcel: builder.mutation<void, string>({
      query: (parcelId) => ({
        url: `/api/v1/parcels/${parcelId}`,
        method: 'DELETE',
      }),
    }),

    // Customer parcel endpoints
    getSentParcels: builder.query<
      Page<Parcel>,
      { customerId: string; pageable: { size: number; page: number } }
    >({
      query: ({ customerId, pageable }) => ({
        url: `/api/v1/parcels/${customerId}/sent`,
        params: pageable,
      }),
      providesTags: (_result, _error, { customerId }) => [
        { type: 'Parcel', id: `customer-${customerId}-sent` },
      ],
    }),

    getReceivedParcels: builder.query<
      Page<Parcel>,
      { customerId: string; pageable: { size: number; page: number } }
    >({
      query: ({ customerId, pageable }) => ({
        url: `/api/v1/parcels/${customerId}/received`,
        params: pageable,
      }),
      providesTags: (_result, _error, { customerId }) => [
        { type: 'Parcel', id: `customer-${customerId}-received` },
      ],
    }),

    getCustomerParcels: builder.query<
      Page<Parcel>,
      {
        customerId: string
        pageable: { size: number; page: number; sort?:string }
      }
    >({
      query: ({ customerId, pageable }) => ({
        url: `/api/v1/parcels/${customerId}/all`,
        params: pageable,
      }),
      providesTags: (_result, _error, { customerId }) => [
        { type: 'Parcel', id: `customer-${customerId}-all` },
      ],
    }),

    getSentParcelsCount: builder.query<number, string>({
      query: (customerId) => `/api/v1/parcels/${customerId}/sent/count`,
      providesTags: (_result, _error, customerId) => [
        { type: 'Parcel', id: `customer-${customerId}-sent-count` },
      ],
    }),

    getReceivedParcelsCount: builder.query<number, string>({
      query: (customerId) => `/api/v1/parcels/${customerId}/received/count`,
      providesTags: (_result, _error, customerId) => [
        { type: 'Parcel', id: `customer-${customerId}-received-count` },
      ],
    }),

    getCustomerParcelsCount: builder.query<number, string>({
      query: (customerId) => `/api/v1/parcels/${customerId}/count`,
      providesTags: (_result, _error, customerId) => [
        { type: 'Parcel', id: `customer-${customerId}-all-count` },
      ],
    }),
  }),
})

export const {
  useCreateParcelMutation,
  useDownloadParcelReceiptMutation,
  useChangeParcelStatusMutation,
  useGetParcelTrackingInfoQuery,
  useSearchParcelsQuery,
  useSoftDeleteParcelMutation,
  // Customer parcel hooks
  useGetSentParcelsQuery,
  useGetReceivedParcelsQuery,
  useGetCustomerParcelsQuery,
  useGetSentParcelsCountQuery,
  useGetReceivedParcelsCountQuery,
  useGetCustomerParcelsCountQuery,
} = parcelApiSlice