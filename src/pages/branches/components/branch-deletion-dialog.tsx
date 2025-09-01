'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Branch } from '@/types/parcel'
import { useDeleteBranchMutation } from '@/api/slices/branchApiSlice'
import { useAppDispatch } from '@/redux/store'
import { notifySuccess, notifyError } from '@/components/custom/notify'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Branch
}

export function BranchDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation()
  const dispatch = useAppDispatch()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.name) return

    try {
      await deleteBranch(currentRow.branchId).unwrap()
      // Use global app alert for feedback
      notifySuccess(dispatch, 'Branch deleted', `${currentRow.name} has been deleted.`)
    } catch (err: any) {
      console.error('Failed to delete branch', err)
      const message = err?.data?.message ?? err?.message ?? 'Failed to delete branch. Please try again.'
      notifyError(dispatch, 'Delete failed', message)
    } finally {
      // Close and reset dialog regardless of outcome (per your request)
      setValue('')
      onOpenChange(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        if (!state) setValue('')
        onOpenChange(state)
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isDeleting}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle className='stroke-destructive mr-1 inline-block' size={18} /> Delete Branch
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to permanently delete <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action cannot be undone and will remove the branch from the system.
          </p>

          <div className='space-y-2'>
            <Label htmlFor='confirm-branch-name'>To confirm, type the branch name:</Label>
            <Input
              id='confirm-branch-name'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${currentRow.name}" to confirm`}
              className='w-full'
            />
          </div>

          <Alert variant='destructive'>
            <AlertTitle>Important!</AlertTitle>
            <AlertDescription>
              <ul className='list-disc list-inside space-y-1'>
                <li>Deleting a branch will remove it from lists and may affect historical records.</li>
                <li>Consider deactivating (archiving) instead if you may need to restore it later.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? 'Deleting…' : 'Delete Branch'}
      destructive
    />
  )
}