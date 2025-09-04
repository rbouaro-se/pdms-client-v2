import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetMonthlyParcelStatsQuery } from '@/api/slices/dashboardApiSlice'
import { Skeleton } from '@/components/ui/skeleton'
// import { MonthlyParcelStats } from '@/types'

// Fallback data in case API is not available
// const fallbackData: MonthlyParcelStats[] = [
//   { month: 'Jan', total: 245, registered: 30, inTransit: 35, availableForPickup: 15, delivered: 150, returned: 15 },
//   { month: 'Feb', total: 312, registered: 40, inTransit: 45, availableForPickup: 20, delivered: 190, returned: 17 },
//   { month: 'Mar', total: 278, registered: 35, inTransit: 40, availableForPickup: 18, delivered: 170, returned: 15 },
//   { month: 'Apr', total: 356, registered: 45, inTransit: 50, availableForPickup: 25, delivered: 220, returned: 16 },
//   { month: 'May', total: 298, registered: 38, inTransit: 42, availableForPickup: 20, delivered: 180, returned: 18 },
//   { month: 'Jun', total: 334, registered: 42, inTransit: 48, availableForPickup: 22, delivered: 205, returned: 17 },
// ]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0)

    return (
      <div className="bg-background border rounded-lg p-3 shadow-md">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">Total: {total.toLocaleString()}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function Overview() {
  const { data: monthlyStats, isLoading, error } = useGetMonthlyParcelStatsQuery()

  // const chartData = monthlyStats && monthlyStats.length > 0 ? monthlyStats : fallbackData
  const chartData = monthlyStats ?? []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Overview</CardTitle>
          <CardDescription>Monthly parcel volume and status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <div className="flex h-[350px] items-center justify-center text-muted-foreground">
        Failed to load delivery overview data
      </div>
    )
  }



  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="delivered"
          stackId="a"
          fill="#10b981"
          name="Delivered"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="inTransit"
          stackId="a"
          fill="#3b82f6"
          name="In Transit"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="availableForPickup"
          stackId="a"
          fill="#f59e0b"
          name="Available for Pickup"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="registered"
          stackId="a"
          fill="#8b5cf6"
          name="Registered"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="returned"
          stackId="a"
          fill="#ef4444"
          name="Returned"
          radius={[0, 0, 4, 4]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}