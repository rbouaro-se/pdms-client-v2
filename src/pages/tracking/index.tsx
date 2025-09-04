import { useEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { IconSearch } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { useGetCustomerParcelsQuery } from '@/api/slices/parcelApiSlice'
import { NewDelivery } from './components/new-delivery'
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import RouteMap from './components/tracking-map'
import { Label } from '@/components/ui/label'
import { BadgeCheckIcon, Package, Truck, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/redux/store'
import { Parcel } from '@/types/parcel'
import moment from 'moment'
import LongText from '@/components/long-text'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID

export default function Tracking() {
  const [search, setSearch] = useState('')
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)
  const [mobileSelectedParcel, setMobileSelectedParcel] = useState<Parcel | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [createConversationDialogOpened, setCreateConversationDialog] = useState(false)
  const { trackingId } = useParams();

  const navigate = useNavigate()

  // Get current customer ID from Redux store
  const customerId = useAppSelector((state) => state.auth.user?.id)

  // Fetch customer parcels
  const { data: parcelsResponse } = useGetCustomerParcelsQuery(
    { customerId: customerId || '', pageable: { size: 50, page: 0 } },
    { skip: !customerId }
  )

  // Set search to trackingId when it changes
  useEffect(() => {
    if (trackingId) {
      setSearch(trackingId)
    }
  }, [trackingId])

  // Auto-select the parcel when trackingId is provided
  useEffect(() => {
    if (trackingId && parcelsResponse?.content) {
      const matchingParcel = parcelsResponse.content.find(
        parcel => parcel.parcelId === trackingId
      )
      if (matchingParcel) {
        setSelectedParcel(matchingParcel)
        setMobileSelectedParcel(matchingParcel)
      }
    }
  }, [trackingId, parcelsResponse])

  // Filter parcels based on search
  const filteredParcels = parcelsResponse?.content?.filter(parcel =>
    parcel.parcelId.toLowerCase().includes(search.trim().toLowerCase()) ||
    parcel.recipient?.name?.toLowerCase().includes(search.trim().toLowerCase()) 
  )

  // Format status text
  const formatStatus = (status: string): string => {
    return status
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'delivered': return 'bg-green-500'
      case 'in-transit': return 'bg-blue-500'
      case 'available_for_pickup': return 'bg-orange-500'
      case 'returned': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Main fixed
      className={cn(
        'container',
        'ml-auto w-full max-w-full',
        'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
        'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
        'sm:transition-[width] sm:duration-200 sm:ease-linear',
        'flex h-svh flex-col',
        'group-data-[scroll-locked=1]/body:h-full',
        'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
      )}
    >

      <section className='flex h-full gap-6'>
        {/* Left Side */}
        <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
          <div className='bg-background sticky top-0 z-10 -mx-4 px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>

            <div className='flex items-center justify-between py-2'>
              <div className='flex gap-2'>
                <h1 className='text-md font-bold'>Deliveries</h1>
                <Truck size={20} />
              </div>

              <Button variant="secondary" onClick={() => {
                navigate("/pages/customer")
              }}>
                <Package size={20} />
                My Parcels
              </Button>
            </div>

            <label className='border-input focus-within:ring-ring flex h-12 w-full items-center space-x-0 rounded-md border pl-2 focus-within:ring-1 focus-within:outline-hidden'>
              <IconSearch size={15} className='mr-2 stroke-slate-500' />
              <span className='sr-only'>Search</span>
              <input
                type='text'
                className='w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden'
                placeholder='Search parcel...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          <ScrollArea className='-mx-3 h-full overflow-scroll p-3'>
            {filteredParcels?.map((parcel) => {
              return (
                <Fragment key={parcel.parcelId}>
                  <button
                    type='button'
                    className={cn(
                      `hover:bg-secondary/75 -mx-1 w-full rounded-md px-2 py-2 text-left text-sm`,
                      selectedParcel?.parcelId === parcel.parcelId && 'sm:bg-muted'
                    )}
                    onClick={() => {
                      setSelectedParcel(parcel)
                      setMobileSelectedParcel(parcel)
                    }}
                  >

                    {/* Tracking ID, Status, and Created Date */}
                    <div className="flex w-full justify-between items-start mb-1">
                      <div>
                        <div className="font-medium text-base">
                          #{parcel.parcelId}
                        </div>
                        {parcel.createdAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {moment(new Date(parcel.createdAt).toLocaleDateString()).format("lll")}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className={getStatusColor(parcel.status)}>
                        <BadgeCheckIcon size={12} /> {formatStatus(parcel.status)}
                      </Badge>
                    </div>

                    {/* Route Visualization */}
                    <div className="relative h-4 flex items-center w-full mb-2 mt-4">
                      {/* Origin point */}
                      <div className="absolute left-0 w-4 h-4 rounded-full bg-amber-900 border border-amber-500 z-10"></div>

                      {/* Completed route line (brown) */}
                      <div
                        className="absolute left-1 h-0.5 bg-brown-500 z-0"
                        style={{
                          width: '50%',
                          backgroundColor: '#8B4513'
                        }}
                      ></div>

                      {/* Remaining route line (gray) */}
                      <div
                        className="absolute h-0.5 bg-gray-300 z-0"
                        style={{
                          left: 'calc(50% + 0.25rem)',
                          right: '1rem'
                        }}
                      ></div>

                      {/* Car marker */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#8B4513"
                            className="w-4 h-4"
                          >
                            <path d="M18 18.5C18.83 18.5 19.5 17.83 19.5 17S18.83 15.5 18 15.5 16.5 16.17 16.5 17 17.17 18.5 18 18.5M19.5 9.5H17V12H21.46L19.5 9.5M6 18.5C6.83 18.5 7.5 17.83 7.5 17S6.83 15.5 6 15.5 4.5 16.17 4.5 17 5.17 18.5 6 18.5M20 8L23 12V17H21C21 18.66 19.66 20 18 20S15 18.66 15 17H9C9 18.66 7.66 20 6 20S3 18.66 3 17H1V6C1 4.89 1.89 4 3 4H17V8H20M3 6V11H10.32C10.74 9.5 12.04 8.5 13.5 8.5H15V6H3Z" />
                          </svg>
                        </div>
                      </div>

                      {/* Destination point */}
                      <div className="absolute right-0 w-4 h-4 rounded-full bg-gray-400 border border-gray-500 z-10"></div>
                    </div>

                    <div className="flex w-full gap-2 justify-between items-center mb-4 text-xs text-muted-foreground">
                      <span className='text-left truncate'>
                        {parcel.origin?.name || 'Unknown Origin'}
                      </span>
                      <span className='text-right truncate'>
                        {parcel.destination?.name || 'Unknown Destination'}
                      </span>
                    </div>

                    <div className='flex gap-2'>
                      <Package size={18} />
                      <div>
                        <span className='col-start-2 row-span-2 font-medium'>
                          {parcel.recipient?.name || 'Unknown Recipient'}
                        </span>
                        <span className='text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis'>
                          Recipient
                        </span>
                      </div>
                    </div>
                  </button>
                  <Separator className='my-1' />
                </Fragment>
              )
            })}
          </ScrollArea>
        </div>

        {/* Right Side */}
        {selectedParcel ? (
          <div
            className={cn(
              'bg-primary-foreground absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex',
              mobileSelectedParcel && 'left-0 flex'
            )}
          >
            {/* Top Part */}
            <div className='bg-secondary mb-1 flex flex-none justify-between p-4 shadow-lg'>
                {/* Left */}
              <div className='flex gap-3'>
                
                <div className='flex items-center gap-2 lg:gap-4'>
                  <div>
                    <div>
                    <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base mr-2'>
                      {selectedParcel.parcelId}
                      </span>
                      <Badge variant="secondary" className={getStatusColor(selectedParcel.status)}>
                        <BadgeCheckIcon size={12} /> {formatStatus(selectedParcel.status)}
                      </Badge>
                    </div>
                    <span className='text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm'>
                     ({selectedParcel.parcelType.toUpperCase()}) {selectedParcel.contentDescription}
                    </span>
                  </div>
                </div>
              </div>
              {/* Right */}
              <div className='-mr-1 flex items-center gap-1 lg:gap-2 ml-auto'>
                <div className="flex items-start gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="terms-2">Enable Preview</Label>
                    <p className="text-muted-foreground text-sm">
                      You can enable or disable preview at any time.
                    </p>
                  </div>
                  <Checkbox
                    id="terms-2"
                    checked={showDetails}
                    onCheckedChange={() => setShowDetails(!showDetails)}
                  />
                </div>
              </div>
            </div>

            {/* Tracking Content */}
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex size-full flex-1'>
                <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                  <div className='chat-flex flex h-40 w-full grow justify-start gap-4 overflow-y-auto pr-4'>
                    <RouteMap
                      origin={{ lat: selectedParcel.origin.location.latitude, lng: selectedParcel.origin.location.longitude }}
                      destination={{ lat: selectedParcel.destination.location.latitude, lng: selectedParcel.destination.location.longitude }}
                    />

                    {/* Details overlay card */}
                    {showDetails && selectedParcel && (
                      <div className='absolute bottom-4 left-4 right-4 bg-background rounded-lg shadow-lg p-4 max-w-md z-10'>
                        <div className='flex justify-between items-start mb-2'>
                          <h3 className='font-bold text-lg'>Parcel Details</h3>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setShowDetails(false)}
                            className='h-6 w-6'
                          >
                            <X size={16} />
                          </Button>
                        </div>

                        <div className='grid grid-cols-2 gap-2 text-sm'>
                          <div className='col-span-2 flex justify-between'>
                            <span className='text-muted-foreground'>Tracking #</span>
                            <span className='font-medium'>#{selectedParcel.parcelId}</span>
                          </div>

                          <div>
                            <span className='text-muted-foreground'>Status</span>
                            <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${selectedParcel.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              selectedParcel.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                              {formatStatus(selectedParcel.status)}
                            </div>
                          </div>

                          <div>
                            <span className='text-muted-foreground'>Est. Delivery</span>
                            <span className='block'>
                              {selectedParcel.deliveryDate ? new Date(selectedParcel.deliveryDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>

                          <div className='col-span-2'>
                            <span className='text-muted-foreground'>From</span>
                            <span className='block'>{selectedParcel.origin?.name || 'Unknown'}</span>
                            <LongText>{selectedParcel.origin?.location.description || 'Description Location'}</LongText>
                          </div>

                          <div className='col-span-2'>
                            <span className='text-muted-foreground'>To</span>
                            <span className='block'>{selectedParcel.destination?.name || 'Unknown'}</span>
                            <LongText>{selectedParcel.destination?.location.description || 'Description Location'}</LongText>
                          </div>

                          <div>
                            <span className='text-muted-foreground'>Weight</span>
                            <span className='block'>{selectedParcel.weightKg?.toFixed(2) || '0.00'} kg</span>
                          </div>

                          <div>
                            <span className='text-muted-foreground'>Dimensions</span>
                            <span className='block'>
                              {selectedParcel.dimension?.lengthCm || '0'}x{selectedParcel.dimension?.widthCm || '0'}x{selectedParcel.dimension?.heightCm || '0'} cm
                            </span>
                          </div>

                          <div className='col-span-2'>
                            <span className='text-muted-foreground'>Recipient</span>
                            <span className='block'>{selectedParcel.recipient?.name || 'Unknown'}</span>
                            {selectedParcel.recipient?.phoneNumber && (
                              <span className='block text-xs text-muted-foreground'>
                                {selectedParcel.recipient.phoneNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'bg-primary-foreground absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex'
            )}
          >
            <APIProvider apiKey={GOOGLE_API_KEY}>
              <Map
                mapId={GOOGLE_MAP_ID}
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: 5.954237, lng: -0.400682 }}
                defaultZoom={10}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
              />
            </APIProvider>
          </div>
        )}
      </section>
      <NewDelivery
        parcels={[]}
        onOpenChange={setCreateConversationDialog}
        open={createConversationDialogOpened}
      />
    </Main>
  )
}