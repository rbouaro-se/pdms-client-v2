import { useEffect, useState } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { dummyParcels } from './data/apps'
import { ParcelList } from './components/ParcelList'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ParcelCard } from './components/ParcelCard'
import { Parcel } from '@/types/parcel'
import { useParams } from 'react-router-dom' // Changed from react-router-dom
import { incomingColumns, outgoingColumns } from './components/columns'
import { DataTable } from '../parcels/components/data-table'
import {
  useGetSentParcelsQuery,
  useGetReceivedParcelsQuery,
  useGetSentParcelsCountQuery,
  useGetReceivedParcelsCountQuery
} from '@/api/slices/parcelApiSlice'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function Customer() {

  const params = useParams();
  const customerId = params.customerId as string;

  const pageable = { page: 0, size: 200 }

  // Fetch sent and received parcels
  const {
    data: sentParcelsData,
    isLoading: isLoadingSent,
    error: sentError,
  } = useGetSentParcelsQuery({
    customerId,
    pageable
  }, { skip: !customerId })

  const {
    data: receivedParcelsData,
    isLoading: isLoadingReceived,
    error: receivedError,
  } = useGetReceivedParcelsQuery({
    customerId,
    pageable
  }, { skip: !customerId })

  // Fetch counts
  const { data: sentCount } = useGetSentParcelsCountQuery(customerId, { skip: !customerId })
  const { data: receivedCount } = useGetReceivedParcelsCountQuery(customerId, { skip: !customerId })

  const sendingParcels = sentParcelsData?.content || []
  const receivingParcels = receivedParcelsData?.content || []

  const isLoading = isLoadingSent || isLoadingReceived
  const hasError = sentError || receivedError

  const handleTrackParcel = (parcelId: string) => {
    // Navigate to tracking page or show tracking modal
    console.log('Tracking parcel:', parcelId);
  };

  if (hasError) {
    return (
      <>
        <Header fixed>
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
        <Main className='container'>
          <div className='mb-2 flex items-center justify-between space-y-2'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>Customer Delivery History</h1>
              <p className='text-muted-foreground'>
                {customerId ? `Viewing delivery history for customer ID: ${customerId}` : 'No customer selected'}
              </p>
            </div>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load parcel history. Please try again.
            </AlertDescription>
          </Alert>
        </Main>
      </>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
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
      <Main className='container'>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Customer Delivery History</h1>
            <p className='text-muted-foreground'>
              {customerId ? `Viewing delivery history for customer ID: ${customerId}` : 'No customer selected'}
            </p>
          </div>
         
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <Tabs
            orientation='vertical'
            defaultValue='incoming'
            className='space-y-4'
          >
            <div className='w-full overflow-x-auto pb-2'>
              <TabsList>
                <TabsTrigger value='incoming'>
                  Incoming ({receivingParcels.length})
                </TabsTrigger>
                <TabsTrigger value='outgoing'>
                  Outgoing ({sendingParcels.length})
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value='incoming' className='space-y-4'>
              <DataTable
                data={receivingParcels}
                columns={incomingColumns}
              />
            </TabsContent>
            <TabsContent value='outgoing' className='space-y-4'>
              <DataTable
                data={sendingParcels}
                columns={outgoingColumns}
              />
            </TabsContent>
          </Tabs>
        )}
      </Main>
    </>
  )
}