import { MonthlyParcelStats, ParcelStatistics, RecentDelivery } from '@/types';
import { API } from '../index';


export const dashboardApiSlice = API.injectEndpoints({
  endpoints: (builder) => ({
    getParcelStatistics: builder.query<ParcelStatistics, void>({
      query: () => '/api/v1/dashboard/statistics/parcels',
      providesTags: ['Dashboard'],
    }),
    getMonthlyParcelStats: builder.query<MonthlyParcelStats[], void>({
      query: () => '/api/v1/dashboard/monthly-parcels-stats',
      providesTags: ['Dashboard'],
    }),
    getRecentDeliveries: builder.query<RecentDelivery[], void>({
      query: () => '/api/v1/dashboard/recent-deliveries',
      providesTags: ['Dashboard'],
    }),
  }),
})

export const {
  useGetParcelStatisticsQuery,
  useGetMonthlyParcelStatsQuery,
  useGetRecentDeliveriesQuery,
} = dashboardApiSlice