import { toast } from 'sonner'

import { FrontendStatus } from "@/types"
import { IconClock, IconTruck, IconCheck } from "@tabler/icons-react"

export const statusConfig = {
  delivered: {
    icon: IconCheck,
    variant: 'default' as const,
    label: 'Delivered'
  },
  'in-transit': {
    icon: IconTruck,
    variant: 'secondary' as const,
    label: 'In Transit'
  },
  'available_for_pickup': {
    icon: IconTruck,
    variant: 'secondary' as const,
    label: 'Available for Pickup'
  },
  'returned': {
    icon: IconTruck,
    variant: 'destructive' as const,
    label: 'Returned'
  },
  pending: {
    icon: IconClock,
    variant: 'outline' as const,
    label: 'Pending'
  }
}

// Map backend status to frontend status
export const mapBackendStatus = (status: string): FrontendStatus => {
  switch (status) {
    case 'delivered':
      return 'delivered'
    case 'in-transit':
      return 'in-transit'
    case 'registered':
      return 'pending'
    case 'available_for_pickup':
      return 'available_for_pickup'
    case 'returned':
      return 'returned'
    default:
      return 'pending'
  }
}


export function showSubmittedData(
  data: unknown,
  title: string = 'You submitted the following values:'
) {
  toast.message(title, {
    description: (
      // w-[340px]
      <pre className='mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4'>
        <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
  })
}
