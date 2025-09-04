import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconSearch,
  IconX
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
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ParcelCard } from './components/ParcelCard'
import { Parcel } from '@/types/parcel'
import { useGetCustomerParcelsQuery } from '@/api/slices/parcelApiSlice'
import { useAppSelector } from '@/redux/store'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

const statusFilters = [
  { value: 'all', label: 'All Parcels' },
  { value: 'registered', label: 'Registered' },
  { value: 'in-transit', label: 'In Transit' },
  { value: 'available_for_pickup', label: 'Available for Pickup' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'returned', label: 'Returned' },
]

// Debounce hook for search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function CustomerParcels() {
  const [sort, setSort] = useState<'ascending' | 'descending'>('descending')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [allParcels, setAllParcels] = useState<Parcel[]>([])
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate();
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Get current customer ID from Redux store
  const customerId = useAppSelector((state) => state.auth.user?.id)

  // Fetch parcels using RTK Query - now includes filtering
  const {
    data: parcelsResponse,
    isLoading,
    isError,
    error,
  } = useGetCustomerParcelsQuery(
    {
      customerId: customerId || '',
      pageable: {
        size: 12, // Optimal size for grid layout
        page,
        sort: sort === 'descending' ? 'createdAt,desc' : 'createdAt,asc'
      },
      // status: statusFilter === 'all' ? undefined : statusFilter,
      // search: debouncedSearchTerm || undefined
    },
    {
      skip: !customerId,
      refetchOnMountOrArgChange: true
    }
  )

  // Update hasMore based on response
  useEffect(() => {
    if (parcelsResponse) {
      setHasMore(!parcelsResponse.last)
    }
  }, [parcelsResponse])

  // Handle parcels data - reset when filters change, append when loading more
  useEffect(() => {
    if (parcelsResponse?.content) {
      if (page === 0) {
        // First page or filter change - replace all parcels
        setAllParcels(parcelsResponse.content)
      } else {
        // Subsequent pages - append new parcels with deduplication
        setAllParcels(prev => {
          const existingIds = new Set(prev.map(p => p.parcelId))
          const newParcels = parcelsResponse.content.filter(
            p => !existingIds.has(p.parcelId)
          )
          return [...prev, ...newParcels]
        })
      }
    }
  }, [parcelsResponse, page])

  // Reset to first page when filters or search change
  useEffect(() => {
    setPage(0)
    setHasMore(true)
  }, [statusFilter, debouncedSearchTerm, sort])

  

  const handleTrackParcel = useCallback((parcelId: string) => {
    navigate(`/pages/customer/tracking/${parcelId}`);
  }, [navigate]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1)
    }
  }, [hasMore, isLoading])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  const clearAllFilters = useCallback(() => {
    setStatusFilter('all')
    setSearchTerm('')
    setSort('descending')
  }, [])

  // Filter and sort parcels client-side as fallback (though API should handle it)
  const filteredParcels = useMemo(() => {
    let result = [...allParcels]

    // Client-side status filtering (redundant but safe)
    if (statusFilter !== 'all') {
      result = result.filter(parcel => parcel.status === statusFilter)
    }

    // Client-side search (redundant but safe)
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      result = result.filter(parcel =>
        parcel.parcelId?.toLowerCase().includes(searchLower) ||
        parcel.recipient?.name?.toLowerCase().includes(searchLower) ||
        parcel.parcelId?.toLowerCase().includes(searchLower) ||
        parcel.sender?.name?.toLowerCase().includes(searchLower)
      )
    }

    // Client-side sorting
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return sort === 'ascending' ? dateA - dateB : dateB - dateA
    })
  }, [allParcels, statusFilter, debouncedSearchTerm, sort])

  // Count parcels by status for the badge counts
  const statusCounts = useMemo(() => ({
    all: allParcels.length,
    registered: allParcels.filter(p => p.status === 'registered').length,
    in_transit: allParcels.filter(p => p.status === 'in_transit').length,
    available_for_pickup: allParcels.filter(p => p.status === 'available_for_pickup').length,
    delivered: allParcels.filter(p => p.status === 'delivered').length,
    returned: allParcels.filter(p => p.status === 'returned').length,
  }), [allParcels])

  const hasActiveFilters = statusFilter !== 'all' || searchTerm

  if (!customerId) {
    return (
      <Main className='container'>
        <Alert variant="destructive">
          <AlertDescription>
            Please log in to view your parcels.
          </AlertDescription>
        </Alert>
      </Main>
    )
  }

  if (isError) {
    return (
      <Main className='container'>
        <Alert variant="destructive">
          <AlertDescription>
            Error loading parcels: {error?.toString()}
          </AlertDescription>
        </Alert>
      </Main>
    )
  }

  return (
    <Main className='container'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>My Parcels</h1>
          <p className='text-muted-foreground'>
            Manage and track your parcels
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 flex-col gap-4 sm:flex-row'>
          <div className="relative w-full sm:max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder='Search parcels...'
              className='h-10 pl-9 pr-9'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={clearSearch}
              >
                <IconX className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-full sm:w-48'>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{filter.label}</span>
                    <Badge variant="secondary" className="ml-2">
                      {statusCounts[filter.value as keyof typeof statusCounts] || 0}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="whitespace-nowrap"
            >
              Clear All
            </Button>
          )}
        </div>

        <Select value={sort} onValueChange={(value) => setSort(value as 'ascending' | 'descending')}>
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue>
              <div className='flex items-center gap-2'>
                <IconAdjustmentsHorizontal size={18} />
                <span>Sort</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ascending'>
              <div className='flex items-center gap-2'>
                <IconSortAscendingLetters size={16} />
                <span>Oldest First</span>
              </div>
            </SelectItem>
            <SelectItem value='descending'>
              <div className='flex items-center gap-2'>
                <IconSortDescendingLetters size={16} />
                <span>Newest First</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className='mb-6' />

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusFilters.find(f => f.value === statusFilter)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => setStatusFilter('all')}
              >
                <IconX className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={clearSearch}
              >
                <IconX className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredParcels.length} parcel{filteredParcels.length !== 1 ? 's' : ''}
        {hasActiveFilters && ` (filtered from ${allParcels.length} total)`}
      </div>

      {/* Loading State */}
      {isLoading && page === 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Parcels Grid */}
          {filteredParcels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-muted-foreground mb-4 text-lg">
                {hasActiveFilters
                  ? 'No parcels match your filters'
                  : 'You don\'t have any parcels yet'
                }
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredParcels.map(parcel => (
                  <ParcelCard
                    key={parcel.parcelId}
                    parcel={parcel}
                    onTrack={() => handleTrackParcel(parcel.parcelId)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    variant="outline"
                    className="min-w-32"
                  >
                    {isLoading ? (
                      <>
                        <div className={cn("mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent")} />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Main>
  )
}