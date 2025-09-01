import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { IconPackage, IconTruck, IconClock, IconCheck, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { RecentDeliveries } from './components/recent-deliveries'
import { useGetParcelStatisticsQuery } from '@/api/slices/dashboardApiSlice'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { formatCurrency, formatGhanaCedisWithSymbol } from '@/utils'
import TasksProvider, { useTasks } from '../parcels/context/tasks-context'
import { TasksDialogs } from '../parcels/components/tasks-dialogs'
import { ParcelsPrimaryButtons } from '../parcels/components/parcels-primary-buttons'

export default function Dashboard() {
  const { data: statistics, error, isLoading } = useGetParcelStatisticsQuery()
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`
  }

  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) {
      return <IconTrendingUp className="h-4 w-4 text-green-500" />
    } else if (percentage < 0) {
      return <IconTrendingDown className="h-4 w-4 text-red-500" />
    }
    return null
  }

  const getTrendTextColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-500'
    if (percentage < 0) return 'text-red-500'
    return 'text-muted-foreground'
  }

  if (error) {
    return (
      <>
        <Header>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown
              logoutRedirectUrl='/authentication/login'
              profilePageUrl='/pages/admin/settings/profile'
              settingPageUrl='/pages/admin/settings'
            />
          </div>
        </Header>
        <Main>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard statistics. Please try again.
            </AlertDescription>
          </Alert>
        </Main>
      </>
    )
  }

  return (
    <TasksProvider>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown
            logoutRedirectUrl='/authentication/login'
            profilePageUrl='/pages/admin/settings/profile'
            settingPageUrl='/pages/admin/settings'
          />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Delivery Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button variant="outline">Export Report</Button>
            <ParcelsPrimaryButtons />
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Total Parcels Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Parcels
                  </CardTitle>
                  <IconPackage className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatNumber(statistics?.totalParcels || 0)}</div>
                      <p className={`text-xs flex items-center gap-1 ${getTrendTextColor(statistics?.monthlyGrowthPercentage || 0)}`}>
                        {statistics?.monthlyGrowthPercentage !== undefined && getTrendIcon(statistics.monthlyGrowthPercentage)}
                        {statistics?.monthlyGrowthPercentage !== undefined && (
                          `${statistics.monthlyGrowthPercentage > 0 ? '+' : ''}${formatPercentage(statistics.monthlyGrowthPercentage)} from ${statistics?.previousMonthName}`
                        )}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* In Transit Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    In Transit
                  </CardTitle>
                  <IconTruck className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatNumber(statistics?.inTransitParcels || 0)}</div>
                      <p className='text-muted-foreground text-xs'>
                        {formatPercentage(statistics?.inTransitPercentage || 0)} of total parcels
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Pending Delivery Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pending Delivery
                  </CardTitle>
                  <IconClock className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatNumber(statistics?.pendingParcels || 0)}</div>
                      <p className='text-muted-foreground text-xs'>
                        Due today: {formatNumber(statistics?.dueToday || 0)} parcels
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Delivered Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Delivered
                  </CardTitle>
                  <IconCheck className='text-muted-foreground h-4 w-4' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatNumber(statistics?.deliveredParcels || 0)}</div>
                      <p className='text-muted-foreground text-xs'>
                        {formatPercentage(statistics?.deliveredPercentage || 0)} of total parcels
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats Row */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatPercentage(statistics?.deliveredPercentage || 0)}</div>
                      <p className='text-muted-foreground text-xs'>
                        Successful deliveries
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    In Transit Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatPercentage(statistics?.inTransitPercentage || 0)}</div>
                      <p className='text-muted-foreground text-xs'>
                        Currently in transit
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Monthly Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className={`text-2xl font-bold flex items-center gap-1 ${getTrendTextColor(statistics?.monthlyGrowthPercentage || 0)}`}>
                        {statistics?.monthlyGrowthPercentage !== undefined && getTrendIcon(statistics.monthlyGrowthPercentage)}
                        {formatPercentage(statistics?.monthlyGrowthPercentage || 0)}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        From {statistics?.previousMonthName} to {statistics?.currentMonthName}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
       
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatGhanaCedisWithSymbol(statistics?.totalRevenue || 0)}</div>
                      <p className='text-muted-foreground text-xs'>
                        All-time revenue
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatGhanaCedisWithSymbol(statistics?.monthlyRevenue || 0)}</div>
                      <p className={`text-xs flex items-center gap-1 ${getTrendTextColor(statistics?.monthlyRevenueGrowthPercentage || 0)}`}>
                        {statistics?.monthlyRevenueGrowthPercentage !== undefined && getTrendIcon(statistics.monthlyRevenueGrowthPercentage)}
                        {statistics?.monthlyRevenueGrowthPercentage !== undefined && (
                          `${statistics.monthlyRevenueGrowthPercentage > 0 ? '+' : ''}${formatPercentage(statistics.monthlyRevenueGrowthPercentage)} from ${statistics?.previousMonthName}`
                        )}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Revenue Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Weekly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatGhanaCedisWithSymbol(statistics?.weeklyRevenue || 0)}</div>
                      <p className={`text-xs flex items-center gap-1 ${getTrendTextColor(statistics?.weeklyRevenueGrowthPercentage || 0)}`}>
                        {statistics?.weeklyRevenueGrowthPercentage !== undefined && getTrendIcon(statistics.weeklyRevenueGrowthPercentage)}
                        {statistics?.weeklyRevenueGrowthPercentage !== undefined && (
                          `${statistics.weeklyRevenueGrowthPercentage > 0 ? '+' : ''}${formatPercentage(statistics.weeklyRevenueGrowthPercentage)} from last week`
                        )}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Daily Revenue Card */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Daily Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>{formatGhanaCedisWithSymbol(statistics?.dailyRevenue || 0)}</div>
                      <p className={`text-xs flex items-center gap-1 ${getTrendTextColor(statistics?.dailyRevenueGrowthPercentage || 0)}`}>
                        {statistics?.dailyRevenueGrowthPercentage !== undefined && getTrendIcon(statistics.dailyRevenueGrowthPercentage)}
                        {statistics?.dailyRevenueGrowthPercentage !== undefined && (
                          `${statistics.dailyRevenueGrowthPercentage > 0 ? '+' : ''}${formatPercentage(statistics.dailyRevenueGrowthPercentage)} from yesterday`
                        )}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              {/* Delivery Overview Chart */}
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Delivery Overview</CardTitle>
                  <CardDescription>
                    Monthly parcel volume and status distribution
                  </CardDescription>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>

              {/* Recent Deliveries */}
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    {statistics ? (
                      <>Latest delivery statistics and metrics</>
                    ) : (
                      <Skeleton className="h-4 w-48" />
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentDeliveries />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
       <TasksDialogs />
    </TasksProvider>
  )
}