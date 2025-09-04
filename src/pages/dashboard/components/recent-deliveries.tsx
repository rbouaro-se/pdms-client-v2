import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { IconPackage } from '@tabler/icons-react'
import { useGetRecentDeliveriesQuery } from '@/api/slices/dashboardApiSlice'
import { Skeleton } from '@/components/ui/skeleton'
import { formatGhanaianPhoneNumber } from '@/utils'
import { mapBackendStatus, statusConfig } from '@/utils/statuses'

export function RecentDeliveries() {
  const { data: recentDeliveries, isLoading, error } = useGetRecentDeliveriesQuery()

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='flex items-center gap-4'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-3 w-1/2' />
              <Skeleton className='h-3 w-2/3' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !recentDeliveries) {
    return (
      <div className='flex items-center justify-center h-32 text-muted-foreground'>
        Failed to load recent deliveries
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {recentDeliveries.map((delivery) => {
        const frontendStatus = mapBackendStatus(delivery.status)
        const StatusIcon = statusConfig[frontendStatus].icon

        return (
          <div key={delivery.parcelId} className='flex items-center gap-4'>
            <Avatar className='h-10 w-10'>
              <AvatarImage
                src={""}
                alt={delivery.recipient.name}
              />
              <AvatarFallback className='bg-muted'>
                <IconPackage className='h-5 w-5' />
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-1 min-w-0'>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-2 mb-1'>
                  <p className='text-sm font-medium truncate' title={delivery.recipient.name}>
                    {delivery.recipient.name}
                  </p>
                  <Badge
                    variant={statusConfig[frontendStatus].variant}
                    className='flex items-center gap-1 text-xs'
                  >
                    <StatusIcon className='h-3 w-3' />
                    {statusConfig[frontendStatus].label}
                  </Badge>
                </div>

                <div className='space-y-1 text-xs text-muted-foreground'>
                  <p className='truncate' title={delivery.recipient.phone}>
                    +{formatGhanaianPhoneNumber(delivery.recipient.phone)}
                  </p>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-mono text-xs'>#{delivery.parcelId}</span>
                    <span className='text-xs'>{delivery.deliveryTimeDisplay}</span>
                  </div>
                  <p className='truncate' title={delivery.destination}>
                    📍 {delivery.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}