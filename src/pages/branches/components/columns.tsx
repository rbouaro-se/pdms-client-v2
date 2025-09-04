import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import moment from 'moment'
import { Branch } from '@/types/parcel'
import { Mail, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function StatusChip({ isActive }: { isActive: boolean | null | undefined }) {
  const active = Boolean(isActive)
  const label = active ? 'Active' : 'Inactive'

  // Use shadecn's Badge component and apply color classes for clarity.
  // Badge provides the baseline styling; we add text/bg color classes to indicate status.
  return (
    <Badge
      role="status"
      aria-label={`Branch status: ${label}`}
      title={label}
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium',
        active
          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
      )}
    >
      {label}
    </Badge>
  )
}

export const branchColumns: ColumnDef<Branch>[] = [
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
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
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
    accessorKey: 'branchId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Branch ID' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('branchId')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='min-w-0 flex-1'>
        {row.getValue('name')}
      </div>
    ),
    meta: { className: 'min-w-[200px]' }, // Allow name column to expand
  },
  {
    id: 'contact',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Contact' />
    ),
    cell: ({ row }) => {
      const { contact } = row.original
      return (
        <div className='space-y-1 min-w-[180px]'>
          {contact.email && (
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-xs'><Mail size={15} /></span>
              <span className='text-sm truncate' title={contact.email}>
                {contact.email}
              </span>
            </div>
          )}
          {contact.phoneNumber && (
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-xs'><Phone size={15} color='brown' /></span>
              <span className='text-sm'>{contact.phoneNumber}</span>
            </div>
          )}
          {!contact.email && !contact.phoneNumber && (
            <span className='text-muted-foreground text-sm'>No contact info</span>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'location.description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => {
      const location = row.original.location
      return (
        <div className='space-y-1 min-w-[200px] max-w-[420px]'>
          <LongText className='max-w-70 font-medium line-clamp-1'>
            {location.description || 'No description'}
          </LongText>
          <div className='text-sm text-muted-foreground'>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </div>
        </div>
      )
    },
    enableSorting: false,
  },
  // New status column to show operating state as a chip using shadecn Badge
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean | undefined
      return (
        <div className='min-w-[90px]'>
          <StatusChip isActive={isActive} />
        </div>
      )
    },
    enableSorting: true,
    meta: { className: 'w-28' },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <div className='whitespace-nowrap'>{moment(date).format('ll')}</div>
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

// Compact version with combined contact
export const compactBranchColumns: ColumnDef<Branch>[] = [
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
    accessorKey: 'branchId',
    header: 'ID',
    cell: ({ row }) => (
      <LongText className='max-w-24 text-sm'>{row.getValue('branchId')}</LongText>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className='max-w-32 text-sm truncate' title={row.getValue('name')}>
        {row.getValue('name')}
      </div>
    ),
  },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => {
      const { contact } = row.original
      return (
        <div className='space-y-0.5 max-w-32'>
          {contact.email && (
            <div className='text-xs truncate' title={contact.email}>
              {contact.email}
            </div>
          )}
          {contact.phoneNumber && (
            <div className='text-xs'>{contact.phoneNumber}</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean | undefined
      return (
        <div>
          <StatusChip isActive={isActive} />
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]