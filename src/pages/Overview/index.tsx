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

const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function Apps() {
  const [sort, setSort] = useState('ascending')
  const [appType, setAppType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [parcels, setParcels] = useState<Parcel[]>(dummyParcels);

  // Fetch parcels from API or state management
  useEffect(() => {
    // Load your parcels data here
    setParcels([])
  }, []);

  const handleTrackParcel = (parcelId: string) => {
    // Navigate to tracking page or show tracking modal
    console.log('Tracking parcel:', parcelId);
  };

  const registeredParcels = parcels.filter(p => p.status === 'registered');
  const inTransitParcels = parcels.filter(p => p.status === 'in-transit');
  const deliveredParcels = parcels.filter(p => p.status === 'delivered');
  const failedParcels = parcels.filter(p => p.status === 'returned');

  // const filteredApps = apps
  //   .sort((a, b) =>
  //     sort === 'ascending'
  //       ? a.name.localeCompare(b.name)
  //       : b.name.localeCompare(a.name)
  //   )
  //   .filter((app) =>
  //     appType === 'connected'
  //       ? app.connected
  //       : appType === 'notConnected'
  //         ? !app.connected
  //         : true
  //   )
  //   .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
  
    // <Main fixed className='container'>
    //   <div>
    //   <div>
    //     <h1 className='text-2xl font-bold tracking-tight'>
    //       Parcels
    //     </h1>
    //     <p className='text-muted-foreground'>
    //       Here&apos;s a list of your parcels
    //     </p>
    //   </div>
    //   <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
    //     <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
    //       <Input
    //         placeholder='Filter apps...'
    //         className='h-9 w-40 lg:w-[250px]'
    //         value={searchTerm}
    //         onChange={(e) => setSearchTerm(e.target.value)}
    //       />
    //       <Select value={appType} onValueChange={setAppType}>
    //         <SelectTrigger className='w-36'>
    //           <SelectValue>{appText.get(appType)}</SelectValue>
    //         </SelectTrigger>
    //         <SelectContent>
    //           <SelectItem value='all'>All Apps</SelectItem>
    //           <SelectItem value='connected'>Connected</SelectItem>
    //           <SelectItem value='notConnected'>Not Connected</SelectItem>
    //         </SelectContent>
    //       </Select>
    //     </div>

    //     <Select value={sort} onValueChange={setSort}>
    //       <SelectTrigger className='w-16'>
    //         <SelectValue>
    //           <IconAdjustmentsHorizontal size={18} />
    //         </SelectValue>
    //       </SelectTrigger>
    //       <SelectContent align='end'>
    //         <SelectItem value='ascending'>
    //           <div className='flex items-center gap-4'>
    //             <IconSortAscendingLetters size={16} />
    //             <span>Ascending</span>
    //           </div>
    //         </SelectItem>
    //         <SelectItem value='descending'>
    //           <div className='flex items-center gap-4'>
    //             <IconSortDescendingLetters size={16} />
    //             <span>Descending</span>
    //           </div>
    //         </SelectItem>
    //       </SelectContent>
    //     </Select>
    //   </div>
    //   <Separator className='shadow-sm' />

    //   <ParcelList
    //     parcels={parcels}
    //     onTrackParcel={handleTrackParcel}
    //   />
    //   </div>
    // </Main>

    <Main className='container'>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Overview</h1>
        <div className='flex items-center space-x-2'>
          <Button>Refresh</Button>
        </div>
      </div>
      <Tabs
        orientation='vertical'
        defaultValue='all'
        className='space-y-4'
      >
        <div className='w-full overflow-x-auto pb-2'>
          <TabsList>
            <TabsTrigger value='all'>All ({parcels.length})</TabsTrigger>
            <TabsTrigger value='registered'>
              Registered ({registeredParcels.length})
            </TabsTrigger>
            <TabsTrigger value='in_transit'>
              In Transit ({inTransitParcels.length})
            </TabsTrigger>
            <TabsTrigger value='available_for_pickup'>
              Available for Pickup ({failedParcels.length})
            </TabsTrigger>
            <TabsTrigger value='delivered' >
              Delivered ({deliveredParcels.length})
            </TabsTrigger>
            <TabsTrigger value='returned'>
              Returned ({failedParcels.length})
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='all' className='space-y-4'>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parcels.map(parcel => (
              <ParcelCard
                key={parcel.parcelId}
                parcel={parcel}
                onTrack={()=>handleTrackParcel(parcel.parcelId)}
              />
                                    ))}
          </div>
        </TabsContent>
        <TabsContent value='registered' className='space-y-4'>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parcels.map(parcel => (
              <ParcelCard
                key={parcel.parcelId}
                parcel={parcel}
                onTrack={() => handleTrackParcel(parcel.parcelId)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value='in_transit' className='space-y-4'>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parcels.map(parcel => (
              <ParcelCard
                key={parcel.parcelId}
                parcel={parcel}
                onTrack={() => handleTrackParcel(parcel.parcelId)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value='delivered' className='space-y-4'>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parcels.map(parcel => (
              <ParcelCard
                key={parcel.parcelId}
                parcel={parcel}
                onTrack={() => handleTrackParcel(parcel.parcelId)}
              />
            ))}
          </div>
          
        </TabsContent>

        <TabsContent value='returned' className='space-y-4'>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parcels.map(parcel => (
              <ParcelCard
                key={parcel.parcelId}
                parcel={parcel}
                onTrack={() => handleTrackParcel(parcel.parcelId)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </Main>



  )
}
