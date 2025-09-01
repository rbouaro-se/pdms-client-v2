import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconPlayerPlay } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUsers } from '../context/users-context'
import { SystemUser } from '@/types/user'

interface DataTableRowActionsProps {
  row: Row<SystemUser>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()
  const user = row.original

  const isSuspended = user.status === 'suspended' 

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('edit')
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {isSuspended ? (
            // Reinstatement option for suspended users
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('reinstate')
              }}
              className='text-green-600!'
            >
              Reinstate
              <DropdownMenuShortcut>
                <IconPlayerPlay size={16} className='text-green-600' />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ) : (
            // Suspension option for active users
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('suspend')
              }}
              className='text-amber-600!'
            >
              Suspend
              <DropdownMenuShortcut>
                <IconTrash size={16} className='text-amber-600' />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}