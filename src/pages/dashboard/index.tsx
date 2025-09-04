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
import { formatGhanaCedisWithSymbol } from '@/utils'
import TasksProvider from '../parcels/context/tasks-context'
import { TasksDialogs } from '../parcels/components/tasks-dialogs'
import { ParcelsPrimaryButtons } from '../parcels/components/parcels-primary-buttons'
import { useAppSelector } from '@/redux/store'
import { UserRole } from '@/types/user'

// Reusable card components
const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  isLoading
}: {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  trend?: { value: number; label: string };
  isLoading: boolean;
}) => {
  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) return <IconTrendingUp className="h-4 w-4 text-green-500" />
    if (percentage < 0) return <IconTrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  const getTrendTextColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-500'
    if (percentage < 0) return 'text-red-500'
    return 'text-muted-foreground'
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {Icon && <Icon className='text-muted-foreground h-4 w-4' />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className='text-2xl font-bold'>{value}</div>
            {subtitle && (
              <p className='text-muted-foreground text-xs'>{subtitle}</p>
            )}
            {trend && (
              <p className={`text-xs flex items-center gap-1 ${getTrendTextColor(trend.value)}`}>
                {getTrendIcon(trend.value)}
                {trend.label}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

const PercentageCard = ({
  title,
  value,
  description,
  isLoading
}: {
  title: string;
  value: number;
  description: string;
  isLoading: boolean;
}) => {
  const formatPercentage = (percentage: number) => `${percentage.toFixed(1)}%`

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className='text-2xl font-bold'>{formatPercentage(value)}</div>
            <p className='text-muted-foreground text-xs'>{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

const RevenueCard = ({
  title,
  amount,
  trend,
  description,
  isLoading
}: {
  title: string;
  amount: number;
  trend?: { value: number; label: string };
  description?: string;
  isLoading: boolean;
}) => {
  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) return <IconTrendingUp className="h-4 w-4 text-green-500" />
    if (percentage < 0) return <IconTrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  const getTrendTextColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-500'
    if (percentage < 0) return 'text-red-500'
    return 'text-muted-foreground'
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className='text-2xl font-bold'>{formatGhanaCedisWithSymbol(amount)}</div>
            {description && (
              <p className='text-muted-foreground text-xs'>{description}</p>
            )}
            {trend && (
              <p className={`text-xs flex items-center gap-1 ${getTrendTextColor(trend.value)}`}>
                {getTrendIcon(trend.value)}
                {trend.label}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Main dashboard component
export default function Dashboard() {
  const { data: statistics, error, isLoading } = useGetParcelStatisticsQuery()
  const { user } = useAppSelector(state => state.auth)

  const formatNumber = (num: number) => new Intl.NumberFormat().format(num)
  const formatPercentage = (percentage: number) => `${percentage.toFixed(1)}%`

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

  const renderDashboardContent = () => {
    if (!user || user.type !== 'system') return null

    const userRole = user.role as UserRole

    return (
      <>
        {/* Main Statistics Cards - Show different cards based on role */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Total Parcels - Show for all roles */}
          <StatCard
            title={userRole === 'admin' ? 'Total Parcels' : 'Parcels'}
            value={formatNumber(statistics?.totalParcels || 0)}
            icon={IconPackage}
            isLoading={isLoading}
            trend={userRole === 'admin' ? {
              value: statistics?.monthlyGrowthPercentage || 0,
              label: statistics?.monthlyGrowthPercentage !== undefined ?
                `${statistics.monthlyGrowthPercentage > 0 ? '+' : ''}${formatPercentage(statistics.monthlyGrowthPercentage)} from ${statistics?.previousMonthName}`
                : ''
            } : undefined}
          />

          {/* In Transit - Show for all roles */}
          <StatCard
            title="In Transit"
            value={formatNumber(statistics?.inTransitParcels || 0)}
            icon={IconTruck}
            subtitle={`${formatPercentage(statistics?.inTransitPercentage || 0)} of total`}
            isLoading={isLoading}
          />

          {/* Pending Delivery - Show for all roles */}
          <StatCard
            title={userRole === 'admin' ? 'Pending Delivery' : 'Pending'}
            value={formatNumber(statistics?.pendingParcels || 0)}
            icon={IconClock}
            subtitle={userRole === 'admin' ? `Due today: ${formatNumber(statistics?.dueToday || 0)} parcels` : 'To be delivered'}
            isLoading={isLoading}
          />

          {/* Delivered - Show for all roles */}
          <StatCard
            title="Delivered"
            value={formatNumber(statistics?.deliveredParcels || 0)}
            icon={IconCheck}
            subtitle={`${formatPercentage(statistics?.deliveredPercentage || 0)} of total`}
            isLoading={isLoading}
          />
        </div>

        {/* Additional Stats - Show different stats based on role */}
        {userRole === 'admin' && (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <PercentageCard
              title="Success Rate"
              value={statistics?.deliveredPercentage || 0}
              description="Successful deliveries"
              isLoading={isLoading}
            />
            <PercentageCard
              title="In Transit Rate"
              value={statistics?.inTransitPercentage || 0}
              description="Currently in transit"
              isLoading={isLoading}
            />
            <PercentageCard
              title="Monthly Growth"
              value={statistics?.monthlyGrowthPercentage || 0}
              description={`From ${statistics?.previousMonthName} to ${statistics?.currentMonthName}`}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Revenue Section - Show for admin and branch managers */}
        {(userRole === 'admin' || userRole === 'branch_manager') && (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <RevenueCard
              title={userRole === 'admin' ? 'Total Revenue' : 'Branch Revenue'}
              amount={statistics?.totalRevenue || 0}
              description={userRole === 'admin' ? 'All-time revenue' : 'Total branch revenue'}
              isLoading={isLoading}
            />

            <RevenueCard
              title="Monthly Revenue"
              amount={statistics?.monthlyRevenue || 0}
              trend={userRole === 'admin' ? {
                value: statistics?.monthlyRevenueGrowthPercentage || 0,
                label: statistics?.monthlyRevenueGrowthPercentage !== undefined ?
                  `${statistics.monthlyRevenueGrowthPercentage > 0 ? '+' : ''}${formatPercentage(statistics.monthlyRevenueGrowthPercentage)} from ${statistics?.previousMonthName}`
                  : ''
              } : undefined}
              isLoading={isLoading}
            />

            {userRole === 'admin' && (
              <>
                <RevenueCard
                  title="Weekly Revenue"
                  amount={statistics?.weeklyRevenue || 0}
                  trend={{
                    value: statistics?.weeklyRevenueGrowthPercentage || 0,
                    label: statistics?.weeklyRevenueGrowthPercentage !== undefined ?
                      `${statistics.weeklyRevenueGrowthPercentage > 0 ? '+' : ''}${formatPercentage(statistics.weeklyRevenueGrowthPercentage)} from last week`
                      : ''
                  }}
                  isLoading={isLoading}
                />

                <RevenueCard
                  title="Daily Revenue"
                  amount={statistics?.dailyRevenue || 0}
                  trend={{
                    value: statistics?.dailyRevenueGrowthPercentage || 0,
                    label: statistics?.dailyRevenueGrowthPercentage !== undefined ?
                      `${statistics.dailyRevenueGrowthPercentage > 0 ? '+' : ''}${formatPercentage(statistics.dailyRevenueGrowthPercentage)} from yesterday`
                      : ''
                  }}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        )}

        {/* Charts and Recent Activity - Show for all roles but with different titles */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader>
              <CardTitle>
                {userRole === 'admin' ? 'Delivery Overview' :
                  userRole === 'branch_manager' ? 'Branch Overview' : 'Your Activity Overview'}
              </CardTitle>
              <CardDescription>
                {userRole === 'admin' ? 'Monthly parcel volume and status distribution' :
                  userRole === 'branch_manager' ? 'Monthly parcel volume for your branch' :
                    'Your recent parcel processing activity'}
              </CardDescription>
            </CardHeader>
            <CardContent className='pl-2'>
              <Overview />
            </CardContent>
          </Card>

          <Card className='col-span-1 lg:col-span-3'>
            <CardHeader>
              <CardTitle>
                {userRole === 'admin' ? 'Recent Activity' :
                  userRole === 'branch_manager' ? 'Recent Branch Activity' : 'Your Recent Activity'}
              </CardTitle>
              <CardDescription>
                {userRole === 'admin' ? 'Latest delivery statistics and metrics' :
                  userRole === 'branch_manager' ? 'Latest deliveries from your branch' :
                    'Parcels you\'ve recently processed'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentDeliveries />
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <TasksProvider>
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
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>PDMS Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <ParcelsPrimaryButtons />
          </div>
        </div>

        <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='overview' className='space-y-4'>
            {renderDashboardContent()}
          </TabsContent>
        </Tabs>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}