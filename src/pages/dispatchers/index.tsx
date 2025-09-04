'use client'

import { JSX, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Truck, Bike, Bus } from 'lucide-react'
import { DispatchersDialogs } from './components/dispatchers-dialogs'
import { DispatchersPrimaryButtons } from './components/dispatchers-primary-buttons'
import DispatchersContext, { useDispatchers } from './context/dispatchers-context'
import { Dispatcher } from '@/types/dispatcher'
import { useSearchDispatchersQuery } from '@/api/slices/dispatcherApiSlice'

const dispatcherIcons: Record<string, JSX.Element> = {
  truck: <Truck className="text-blue-600" size={28} />,
  van: <Truck className="text-green-600" size={28} />,
  motorcycle: <Bike className="text-orange-600" size={28} />,
  bus: <Bus className="text-purple-600" size={28} />,
}

const typeText = new Map([
  ['ALL', 'All Types'],
  ['truck', 'Truck'],
  ['van', 'Van'],
  ['motorcycle', 'Motorcycle'],
  ['bus', 'Bus'],
])

const getAgentFullName = (agent: { firstName?: string; lastName?: string } | undefined) =>
  agent ? `${agent.firstName ?? ''} ${agent.lastName ?? ''}`.trim() : '—'

function DispatcherCard({ dispatcher }: { dispatcher: Dispatcher }) {
  const { setOpen, setCurrentRow } = useDispatchers()

  const handleEditClick = () => {
    setCurrentRow(dispatcher)
    setOpen('edit')
  }

  return (
    <li
      key={dispatcher.dispatcherId ?? dispatcher.dispatcherId}
      className='rounded-lg border p-4 hover:shadow-md cursor-pointer transition-colors hover:border-primary/50'
      onClick={handleEditClick}
    >
      <div className='mb-6 flex items-center justify-between'>
        <div className='bg-muted flex size-10 items-center justify-center rounded-lg p-2'>
          {dispatcherIcons[dispatcher.type]}
        </div>
        <Button
          variant={dispatcher.available ? 'outline' : 'ghost'}
          size='sm'
          className={dispatcher.available
            ? 'border border-green-300 bg-green-50 hover:bg-green-100 dark:border-green-700 dark:bg-green-950 dark:hover:bg-green-900'
            : 'border border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'}
          disabled={!dispatcher.available}
        >
          {dispatcher.available ? 'Available' : 'Unavailable'}
        </Button>
      </div>
      <div>
        <h2 className='mb-1 font-semibold text-lg'>
          {dispatcher.dispatcherNumber}
        </h2>
        <p className='text-muted-foreground mb-1'>
          Type: <span className='font-medium'>{typeText.get(dispatcher.type)}</span>
        </p>
        <p className='text-muted-foreground'>
          Agent: <span className='font-medium'>{getAgentFullName(dispatcher.agent)}</span>
        </p>
      </div>
    </li>
  )
}

export default function Dispatchers() {
  const [type, setType] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // debounce the search term slightly so we don't spam the backend on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchTerm)
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchTerm), 250)
    return () => window.clearTimeout(t)
  }, [searchTerm])

  // page size for listing (adjust to your needs)
  const pageable = useMemo(() => ({ size: 200, page: 0 }), [])

  // Use RTK Query searchDispatchers query - it returns a Page<DispatcherResponse>
  const { data, isLoading, isFetching, isError, refetch } = useSearchDispatchersQuery({
    pageable,
    searchTerm: debouncedSearch || undefined
  })

  // Map backend results content to Dispatcher[]; result may be undefined while loading
  const dispatchers: Dispatcher[] = data?.content ?? []

  // Local derived filtered list for client-side safety (ensures UI still filters if backend didn't)
  const filteredDispatchers = dispatchers
    .filter((d) => (type === 'ALL' ? true : d.type === type))
    .filter(
      (d) =>
        d.dispatcherNumber?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        getAgentFullName(d.agent).toLowerCase().includes(debouncedSearch.toLowerCase())
    )

  return (
    <DispatchersContext>
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown
            logoutRedirectUrl='/authentication/login'
            profilePageUrl='/pages/admin/settings/profile'
            settingPageUrl='/pages/admin/settings'
          />
        </div>
      </Header>

      <Main>
        <div>
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>
                Dispatchers
              </h1>
              <p className='text-muted-foreground'>
                Browse and manage your delivery dispatchers by type and availability.
              </p>
            </div>
            <DispatchersPrimaryButtons />
          </div>

          <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
            <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
              <Input
                placeholder='Search by number or agent...'
                className='h-9 w-40 lg:w-[250px]'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className='w-36'>
                  <SelectValue>{typeText.get(type)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>All Types</SelectItem>
                  <SelectItem value='truck'>Truck</SelectItem>
                  <SelectItem value='van'>Van</SelectItem>
                  <SelectItem value='motorcycle'>Motorcycle</SelectItem>
                  <SelectItem value='bus'>Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator className='shadow-sm' />

          {/* States: loading, error, empty, list */}
          {isLoading || isFetching ? (
            <div className='p-4 text-sm text-muted-foreground'>Loading dispatchers…</div>
          ) : isError ? (
            <div className='p-4 text-sm text-destructive'>
              Failed to load dispatchers. <Button variant='link' onClick={() => refetch()}>Retry</Button>
            </div>
          ) : filteredDispatchers.length === 0 ? (
            <div className='p-6 text-sm text-muted-foreground'>No dispatchers found.</div>
          ) : (
            <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
              {filteredDispatchers.map((dispatcher) => (
                <DispatcherCard key={dispatcher.dispatcherId ?? dispatcher.dispatcherId} dispatcher={dispatcher} />
              ))}
            </ul>
          )}
        </div>
      </Main>

      <DispatchersDialogs />
    </DispatchersContext>
  )
}