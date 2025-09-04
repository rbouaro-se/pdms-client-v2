import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { CheckCircleIcon, TruckIcon, UndoIcon, WarehouseIcon } from 'lucide-react'
import { Parcel } from '@/types/parcel'
import { cn } from '@/lib/utils'

export const parcelStatuses = [
  {
    value: 'registered',
    label: 'Registered',
    icon: CheckCircleIcon
  },
  {
    value: 'in_transit',
    label: 'In Transit',
    icon: TruckIcon,
  },
  {
    value: 'available_for_pickup',
    label: 'Available for Pickup',
    icon: WarehouseIcon,
  },
  {
    value: 'delivered',
    label: 'Delivered',
    icon: CheckCircleIcon,
  },
  {
    value: 'returned',
    label: 'Returned',
    icon: UndoIcon,
  },
] as const

export const serviceTypes = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'same_day', label: 'Same Day' },
  { value: 'regular', label: 'Regular' },
] as const

export const columns: ColumnDef<Parcel>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'parcelId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tracking #' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px] font-medium'>
        {row.getValue('parcelId')}
      </div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'sender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sender' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col space-y-1'>
        <span className='font-medium truncate max-w-[200px]'>
          {row.original.sender.name}
        </span>
        <span className='text-sm text-muted-foreground truncate max-w-[200px]'>
          +{row.original.sender.phoneNumber}
        </span>
      </div>
    ),
    filterFn: (row, _, value) => {
      return (
        row.original.recipient.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.recipient.phoneNumber.toLowerCase().includes(value.toLowerCase())
      )
    },
  },
  {
    accessorKey: 'origin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Origin' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col space-y-1'>
        <span className='font-medium truncate max-w-[200px]'>
          {row.original.origin.name}
        </span>
        <span className='text-sm text-muted-foreground truncate max-w-[200px]'>
          {row.original.origin.location.description}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'deliveryType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Service' />
    ),
    cell: ({ row }) => {
      const service = serviceTypes.find(
        (service) => service.value === row.getValue('deliveryType')
      )

      return (
        <Badge variant='outline' className='min-w-[80px] justify-center'>
          {service?.label || row.getValue('deliveryType')}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'parcelType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-[200px] truncate'>
          {row.getValue("parcelType")}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'destination',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Destination' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col space-y-1'>
        <span className='font-medium truncate max-w-[200px]'>
          {row.original.destination.name}
        </span>
        <span className='text-sm text-muted-foreground truncate max-w-[200px] truncate'>
          {row.original.destination.location.description}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'recipient',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Recipient' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col space-y-1'>
        <span className='font-medium truncate max-w-[200px]'>
          {row.original.recipient.name}
        </span>
        <span className='text-sm text-muted-foreground truncate max-w-[200px]'>
          +{row.original.recipient.phoneNumber}
        </span>
      </div>
    ),
    filterFn: (row, _id, value) => {
      return (
        row.original.recipient.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.recipient.phoneNumber.toLowerCase().includes(value.toLowerCase())
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Delivery Status' />
    ),
    cell: ({ row }) => {
      const status = parcelStatuses.find(
        (status) => status.value === row.getValue('status')
      )
      const deliveryDate = new Date(row.original.deliveryDate)
      const today = new Date()

      if (!status) {
        return null
      }

      const showDeliveryEstimate = !['delivered', 'returned', 'available_for_pickup'].includes(row.getValue('status'))

      return (
        <div className='flex w-[180px] flex-col space-y-2'>
          <div className='flex items-center'>
            {status.icon && (
              <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
            )}
            <Badge variant={getStatusBadgeVariant(row.getValue('status'))}>
              {status.label}
            </Badge>
          </div>

          {showDeliveryEstimate && (
            <div className='text-xs text-muted-foreground'>
              {/* <div className='font-medium'>Est. delivery:</div> */}
              <div className={cn(
                'mt-0.5',
                deliveryDate < today && 'text-destructive font-medium'
              )}>
                {getRelativeDeliveryDate(deliveryDate)}
              </div>
            </div>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

// Helper function for status badge variants
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'delivered':
      return 'secondary'
    case 'in_transit':
      return 'default'
    case 'available_for_pickup':
      return 'secondary'
    case 'returned':
      return 'destructive'
    case 'registered':
      return 'outline'
    default:
      return 'outline'
  }
}

// Helper function to get relative delivery date
function getRelativeDeliveryDate(deliveryDate: Date): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const delivery = new Date(deliveryDate)
  delivery.setHours(0, 0, 0, 0)

  const diffTime = delivery.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Handle overdue deliveries (past dates)
  if (diffDays < 0) {
    const absDays = Math.abs(diffDays)

    if (absDays === 1) {
      return 'due 1 day ago'
    } else if (absDays < 7) {
      return `due ${absDays} days ago`
    } else if (absDays < 30) {
      const weeks = Math.floor(absDays / 7)
      return weeks === 1 ? 'due 1 week ago' : `due ${weeks} weeks ago`
    } else if (absDays < 365) {
      const months = Math.floor(absDays / 30)
      return months === 1 ? 'due 1 month ago' : `due ${months} months ago`
    } else {
      const years = Math.floor(absDays / 365)
      return years === 1 ? 'due 1 year ago' : `due ${years} years ago`
    }
  }

  // Handle future deliveries
  if (diffDays === 0) {
    return 'due today'
  } else if (diffDays === 1) {
    return 'due tomorrow'
  } else if (diffDays === 2) {
    return 'due in 2 days'
  } else if (diffDays === 3) {
    return 'due in 3 days'
  } else if (diffDays <= 7) {
    return `due in ${diffDays} days`
  } else if (diffDays <= 30) {
    const weeks = Math.ceil(diffDays / 7)
    return weeks === 1 ? 'due in 1 week' : `due in ${weeks} weeks`
  } else if (diffDays <= 365) {
    const months = Math.ceil(diffDays / 30)
    return months === 1 ? 'due in 1 month' : `due in ${months} months`
  } else {
    const years = Math.ceil(diffDays / 365)
    return years === 1 ? 'due in 1 year' : `due in ${years} years`
  }
}