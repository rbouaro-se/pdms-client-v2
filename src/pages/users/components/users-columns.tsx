import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { callTypes, userTypes } from '../data/data'
import { User, UserStatus } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { SystemUser } from '@/types/user'
import moment from 'moment'

// Function to format role display names
const formatRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    'customer_service': 'Customer Service',
    'branch_manager': 'Manager',
    'admin': 'Admin',
    'agent': 'Agent',
    'customer': 'Customer'
  };

  return roleMap[role] || role.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

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

export const columns: ColumnDef<SystemUser>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User ID' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('id')}</LongText>
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
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Username' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('username')}</LongText>
    ),
    meta: {
      className: 'w-36'
    },
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      const fullName = `${firstName} ${lastName}`
      return <LongText className='max-w-36'>{fullName}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    id: 'branchInfo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Branch' />
    ),
    cell: ({ row }) => {
      const branch = row.original.branch
      return (
        <div className='flex flex-col space-y-1'>
          <div>{branch?.name}</div>
          <div className='text-xs text-muted-foreground'>{branch?.branchId}</div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const badgeColor = callTypes.get(status as UserStatus)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      const userType = userTypes.find(({ value }) => value === role.toLowerCase())
      const displayName = formatRoleDisplayName(role);

      if (!userType) {
        return (
          <div className='flex items-center gap-x-2'>
            <span className='text-sm capitalize'>{displayName}</span>
          </div>
        )
      }

      return (
        <div className='flex items-center gap-x-2'>
          {userType.icon && (
            <userType.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm'>{displayName}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date Created' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
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
  },
  {
    id: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Updated' />
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return (
        <div className='flex flex-col space-y-1 min-w-[140px]'>
          <div className='text-sm font-medium'>{formatDate(updatedAt)}</div>
          {updatedAt && (
            <div className='text-xs text-muted-foreground'>
              {getRelativeTime(updatedAt)}
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.updatedAt ? moment(rowA.original.updatedAt).valueOf() : 0;
      const dateB = rowB.original.updatedAt ? moment(rowB.original.updatedAt).valueOf() : 0;
      return dateA - dateB;
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]