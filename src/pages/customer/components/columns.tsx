import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { CheckCircleIcon, TruckIcon, UndoIcon, WarehouseIcon } from 'lucide-react'
import { Parcel } from '@/types/parcel'
import moment from 'moment'
import { DataTableRowActions } from './data-table-row-actions'
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
    label: 'Available forPickup',
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

// Function to format date for display using Moment.js
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';

  const date = moment(dateString);
  return date.format('MMM DD, YYYY, hh:mm A');
};

// Function to get relative time (e.g., "2 hours ago")
const getRelativeTime = (dateString: string | undefined): string => {
  if (!dateString) return '-';

  return moment(dateString).fromNow();
};

export const outgoingColumns: ColumnDef<Parcel>[] = [
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
    enableSorting: true,
    enableHiding: false,
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
    filterFn: (row, id, value) => {
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = parcelStatuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[150px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <Badge variant={getStatusBadgeVariant(row.getValue('status'))}>
            {status.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      return (
        <div className='flex flex-col space-y-1 min-w-[140px]'>
          <div className='text-sm font-medium'>{formatDate(createdAt)}</div>
          {createdAt && (
            <div className='text-xs text-muted-foreground'>
              {getRelativeTime(createdAt)}
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.createdAt ? moment(rowA.original.createdAt).valueOf() : 0;
      const dateB = rowB.original.createdAt ? moment(rowB.original.createdAt).valueOf() : 0;
      return dateA - dateB;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: 'deliveryDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Est. Delivery' />
    ),
    cell: ({ row }) => {
      const deliveryDate = row.getValue('deliveryDate') as string;
      const today = moment();
      const deliveryMoment = moment(deliveryDate);
      const isOverdue = deliveryMoment.isBefore(today) && row.original.status !== 'delivered';

      return (
        <div className={cn('flex flex-col space-y-1 min-w-[140px]', isOverdue && 'text-destructive')}>
          <div className='text-sm font-medium'>{formatDate(deliveryDate)}</div>
          {deliveryDate && (
            <div className='text-xs text-muted-foreground'>
              {getRelativeTime(deliveryDate)}
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.deliveryDate ? moment(rowA.original.deliveryDate).valueOf() : 0;
      const dateB = rowB.original.deliveryDate ? moment(rowB.original.deliveryDate).valueOf() : 0;
      return dateA - dateB;
    },
    enableColumnFilter: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

export const incomingColumns: ColumnDef<Parcel>[] = [
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
        row.original.sender.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.sender.phoneNumber.toLowerCase().includes(value.toLowerCase())
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
        <span className='text-sm text-muted-foreground max-w-[200px] truncate'>
          {row.original.destination.location.description}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = parcelStatuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[150px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <Badge variant={getStatusBadgeVariant(row.getValue('status'))}>
            {status.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      return (
        <div className='flex flex-col space-y-1 min-w-[140px]'>
          <div className='text-sm font-medium'>{formatDate(createdAt)}</div>
          {createdAt && (
            <div className='text-xs text-muted-foreground'>
              {getRelativeTime(createdAt)}
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.createdAt ? moment(rowA.original.createdAt).valueOf() : 0;
      const dateB = rowB.original.createdAt ? moment(rowB.original.createdAt).valueOf() : 0;
      return dateA - dateB;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: 'deliveryDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Est. Delivery' />
    ),
    cell: ({ row }) => {
      const deliveryDate = row.getValue('deliveryDate') as string;
      const today = moment();
      const deliveryMoment = moment(deliveryDate);
      const isOverdue = deliveryMoment.isBefore(today) && row.original.status !== 'delivered';

      return (
        <div className={cn('flex flex-col space-y-1 min-w-[140px]', isOverdue && 'text-destructive')}>
          <div className='text-sm font-medium'>{moment(deliveryDate).format("ll")}</div>
          {deliveryDate && (
            <div className='text-xs text-muted-foreground'>
              {getRelativeTime(deliveryDate)}
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.deliveryDate ? moment(rowA.original.deliveryDate).valueOf() : 0;
      const dateB = rowB.original.deliveryDate ? moment(rowB.original.deliveryDate).valueOf() : 0;
      return dateA - dateB;
    },
    enableColumnFilter: false,
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