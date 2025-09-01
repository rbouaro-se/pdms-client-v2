// services/api/configurationApiSlice.ts
import { ConfigurationDto } from '@/types/parcel'
import { API } from '../index'

export const configurationApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    getConfiguration: builder.query<ConfigurationDto, void>({
      query: () => '/api/v1/configurations',
    
    }),

    updateConfiguration: builder.mutation<ConfigurationDto, ConfigurationDto>({
      query: (payload) => ({
        url: '/api/v1/configurations',
        method: 'PUT',
        body: payload,
      }),
    }),
  }),
})

export const { useGetConfigurationQuery, useUpdateConfigurationMutation } =
  configurationApiSlice
