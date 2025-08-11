import { useEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import {
  IconSearch,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { Main } from '@/components/layout/main'

import { NewDelivery } from './components/new-delivery'
import { type ChatUser } from './data/chat-types'
// Fake Data
import { conversations } from './data/convo.json'

import {  APIProvider, Map } from '@vis.gl/react-google-maps';
import RouteMap from './components/tracking-map'
import { Label } from '@/components/ui/label'
import { Switch } from "@/components/ui/switch"
import { BadgeCheckIcon, Truck, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useParams } from 'react-router-dom'

const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;
const GOOGLE_MAP_ID = import.meta.env.GOOGLE_MAP_ID

export default function Tracking() {

  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(
    null
  )

  const [showDetails, setShowDetails] = useState(false);

  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false)
  
  const { trackingId } = useParams();

  useEffect(() => {
    if (trackingId) {
      // const user = conversations.find((user) => user.id === trackingId);

    setSearch(trackingId);

      // if (user) {
      //   setSelectedUser(user);
      //   setMobileSelectedUser(user);
      // }
    }
  }, [trackingId]);

  // Filtered data based on the search query
  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase())
  )

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
                <h1 className='text-md font-bold'>Tracking Delivery</h1>
                <Truck size={20} />
              </div>

              <Label className="flex items-center gap-2 text-sm">
                <span>Delivered</span>
                <Switch className="shadow-none" />
              </Label>
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
            {filteredChatList.map((chatUsr) => {
              const { id,username, fullName } = chatUsr
             
              return (
                <Fragment key={id}>
                  <button
                    type='button'
                    className={cn(
                      `hover:bg-secondary/75 -mx-1  w-full rounded-md px-2 py-2 text-left text-sm`,
                      selectedUser?.id === id && 'sm:bg-muted'
                    )}
                    onClick={() => {
                      setSelectedUser(chatUsr)
                      setMobileSelectedUser(chatUsr)
                    }}
                  >

                    {/* Tracking ID and Status */}
                    <div className="flex w-full justify-between items-center mb-1">
                      <div className=" font-medium ">
                        #PAR-38643
                      </div>
                      <Badge variant="secondary"
                        className='bg-amber-900 text-xs text-white font-semibold'
                      ><BadgeCheckIcon /> Delivered</Badge>

                    </div>

                    {/* Route Visualization */}
                    <div className="relative h-4 flex items-center w-full mb-2 mt-4">
                      {/* Origin point */}
                      <div className="absolute left-0 w-4 h-4 rounded-full bg-amber-900 border border-amber-500 z-10"></div>

                      {/* Completed route line (brown) */}
                      <div
                        className="absolute left-1 h-0.5 bg-brown-500 z-0"
                        style={{
                          width: '50%', // Adjust this percentage based on actual progress
                          backgroundColor: '#8B4513' // Brown color
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
                            fill="#8B4513" // Brown color to match completed route
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
                      <span className='text-left'>
                        Accra, Dzowulu children park
                      </span>
                      <span className='text-right'>
                        Kumasi, Adum kotoko park includes longer name because it is longer
                      </span>
                    </div>


                    <div className='flex gap-2'>
                      <Avatar>
                        <AvatarImage src="" alt={username} />
                        <AvatarFallback>SN</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className='col-start-2 row-span-2 font-medium'>
                          {fullName}
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
        {selectedUser ? (
          <div
            className={cn(
              'bg-primary-foreground absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex',
              mobileSelectedUser && 'left-0 flex'
            )}
          >
            {/* Top Part */}
            <div className='bg-secondary mb-1 flex flex-none justify-between  p-4 shadow-lg'>
              {/* Left */}
              <div className='flex gap-3'>
                {/* <Button
                  size='icon'
                  variant='ghost'
                  className='-ml-2 h-full sm:hidden'
                  onClick={() => setMobileSelectedUser(null)}
                >
                  <IconArrowLeft />
                </Button> */}
                {/* <div className='flex items-center gap-2 lg:gap-4'>
                  <Avatar className='size-9 lg:size-11'>
                    <AvatarImage
                      src={selectedUser.profile}
                      alt={selectedUser.username}
                    />
                    <AvatarFallback>{selectedUser.username}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                      {selectedUser.fullName}
                    </span>
                    <span className='text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm'>
                      {selectedUser.title}
                    </span>
                  </div>
                </div> */}
              </div>

              {/* Right */}
              <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                <div className="flex items-start gap-3">

                  <div className="grid gap-2">
                    <Label htmlFor="terms-2">Enable Preview</Label>
                    <p className="text-muted-foreground text-sm">
                      You can enable or disable preview at any time.
                    </p>
                  </div>
                  <Checkbox id="terms-2" checked={showDetails}
                    onCheckedChange={() => setShowDetails(!showDetails)}
                  />
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className='flex flex-1 flex-col gap-2 '>
              <div className='flex size-full flex-1'>
                <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                  <div className='chat-flex flex h-40 w-full grow  justify-start gap-4 overflow-y-auto pr-4'>
                    <RouteMap origin={{ lat: 5.554237, lng: -0.200682 }}
                      destination={{ lat: 6.698081, lng: -1.624428 }}
                    />

                    {/* Details overlay card */}
                    {showDetails && (
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
                            <span className='font-medium'>#PAR-47463</span>
                          </div>

                          <div>
                            <span className='text-muted-foreground'>Status</span>
                            <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${selectedUser.username === 'delivered' ? 'bg-green-100 text-green-800' :
                              selectedUser.username === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                              Delivered
                            </div>
                          </div>

                          <div>
                            <span className='text-muted-foreground'>Est. Delivery</span>
                            <span className='block'>{new Date().toLocaleDateString()}</span>
                          </div>

                          <div className='col-span-2'>
                            <span className='text-muted-foreground'>From</span>
                            <span className='block'>{selectedUser.title}</span>
                          </div>

                          <div className='col-span-2'>
                            <span className='text-muted-foreground'>To</span>
                            <span className='block'>{selectedUser.title}</span>
                          </div>

                          <div>
                            <span className='text-muted-foreground'>Weight</span>
                            <span className='block'>10 kg</span>
                          </div>

                          <div>
                            <span className='text-muted-foreground'>Dimensions</span>
                            <span className='block'>
                              50x30x400 cm
                            </span>
                          </div>

                          <div className='col-span-2'>
                            <span className='text-muted-foreground'>Contents</span>
                            <span className='block'>{selectedUser.fullName}</span>
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
                defaultCenter={
                  { lat: 5.954237, lng: -0.400682 }
                }
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
