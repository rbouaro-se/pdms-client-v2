import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { parcelSchema } from '../data/schema'
import {
  useDownloadParcelReceiptMutation,
  useChangeParcelStatusMutation,
  useSoftDeleteParcelMutation
} from '@/api/slices/parcelApiSlice'
import { toast } from 'sonner'
import { ParcelStatus } from '@/types/parcel'
import { API } from '@/api'
import { notifyError, notifySuccess } from '@/components/custom/notify'
import { useDispatch } from 'react-redux'

interface DataTableRowActionsProps<Parcel> {
  row: Row<Parcel>
}

export const DeliveryStatuses = [
  { value: 'registered', label: 'Registered' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'available_for_pickup', label: 'Available for Pickup' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'returned', label: 'Returned' }
]

export function DataTableRowActions<Parcel>({
  row,
}: DataTableRowActionsProps<Parcel>) {
  const parcel = parcelSchema.parse(row.original)
const dispatch = useDispatch()
  // API mutations
  const [downloadReceipt, {isLoading: isDownloading}] = useDownloadParcelReceiptMutation()
  const [changeStatus] = useChangeParcelStatusMutation()
  const [softDelete] = useSoftDeleteParcelMutation()

  const handleDownloadReceipt = async () => {
    try {
      const result = await downloadReceipt(parcel.parcelId).unwrap()
      const url = window.URL.createObjectURL(new Blob([result]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `receipt-${parcel.parcelId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Receipt downloaded successfully')
      notifySuccess(dispatch, 'Receipt download', `Receipt ${isDownloading ? 'downloading...' : 'downloaded'}`)
    } catch (error) {
      toast.error('Failed to download receipt')
      console.error('Receipt download failed:', error)
      const err = error as Error
      notifyError(dispatch, 'Receipt download', `Receipt download failed: ${err.message}`)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await changeStatus({
        parcelId: parcel.parcelId,
        payload: { status: newStatus as ParcelStatus }
      }).unwrap()

      API.util.invalidateTags(['Parcel']);

      notifySuccess(dispatch, 'Parcel Delivery', `Status changed to ${DeliveryStatuses.find(s => s.value === newStatus)?.label}`)
    } catch (error) {
      console.error('Status update failed:', error)
      const err = error as Error
      notifyError(dispatch, 'Parcel Delivery', `Status update failed: ${err.message}`)
    }
  }

  const handleDelete = async () => {
    try {
      await softDelete(parcel.parcelId).unwrap()
      // Invalidate the parcels cache to trigger a refetch
      API.util.invalidateTags(['Parcel'])
      notifySuccess(dispatch, 'Delete Parcel', `Parcel deleted successfully`)
    } catch (error) {
      console.error('Delete failed:', error)
      const err = error as Error
      notifyError(dispatch, 'Delete Parcel', `Status update failed: ${err.message}`)
    }
  }

  return (
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
        <DropdownMenuItem onClick={handleDownloadReceipt}>
          Download Receipt
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={parcel.status}
              onValueChange={handleStatusChange}
            >
              {DeliveryStatuses.map((status) => (
                <DropdownMenuRadioItem
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            if (confirm('Are you sure you want to delete this parcel?')) {
              handleDelete()
            }
          }}
          className='text-red-600 focus:text-red-600'
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}