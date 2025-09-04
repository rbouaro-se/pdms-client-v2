'use client'

import { useState } from 'react'
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react'
import { showSubmittedData } from '@/utils/statuses'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Branch } from '@/types/parcel'
import {
  useArchiveBranchMutation,
  useUnarchiveBranchMutation,
} from '@/api/slices/branchApiSlice'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Branch
}

export function BranchDeactivateDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')
  const [archiveBranch, { isLoading: isArchiving }] = useArchiveBranchMutation()
  const [unarchiveBranch, { isLoading: isUnarchiving }] = useUnarchiveBranchMutation()

  // If branch isActive === true -> we're confirming deactivation (archive)
  // If branch isActive === false -> we're confirming activation (unarchive)
  const isDeactivating = Boolean(currentRow?.isActive)

  const handleConfirm = async () => {
    // require exact match to proceed
    if (value.trim() !== currentRow.name) return

    try {
      if (isDeactivating) {
        await archiveBranch(currentRow.branchId).unwrap()
        showSubmittedData(currentRow, 'The following branch has been deactivated:')
      } else {
        await unarchiveBranch(currentRow.branchId).unwrap()
        showSubmittedData(currentRow, 'The following branch has been reactivated:')
      }

      setValue('')
      onOpenChange(false)
    } catch (err: any) {
      console.error('Failed to toggle branch active state', err)
      const message = err?.data?.message ?? err?.message ?? 'Failed to update branch status'
      // Replace alert with your app's toast/notification if available
      alert(message)
    }
  }

  const title = isDeactivating ? (
    <span className='text-destructive'>
      <IconAlertTriangle className='stroke-warning mr-1 inline-block' size={18} /> Deactivate Branch
    </span>
  ) : (
    <span className='text-success'>
      <IconCheck className='inline-block mr-1' size={18} /> Reactivate Branch
    </span>
  )

  const confirmText = isDeactivating ? 'Deactivate Branch' : 'Reactivate Branch'

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        // reset typed confirmation when dialog closes
        if (!state) setValue('')
        onOpenChange(state)
      }}
      handleConfirm={handleConfirm}
      disabled={value.trim() !== currentRow.name || isArchiving || isUnarchiving}
      title={title}
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {isDeactivating ? (
              <>
                Are you sure you want to deactivate <span className='font-bold'>{currentRow.name}</span>?
                <br />
                This action will mark the branch as inactive in the system.
              </>
            ) : (
              <>
                Are you sure you want to reactivate <span className='font-bold'>{currentRow.name}</span>?
                <br />
                This action will mark the branch as active again in the system.
              </>
            )}
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

          <Alert variant={isDeactivating ? 'destructive' : undefined}>
            <AlertTitle>{isDeactivating ? 'Important!' : 'Note'}</AlertTitle>
            <AlertDescription>
              <ul className='list-disc list-inside space-y-1'>
                {isDeactivating ? (
                  <>
                    <li>New parcels cannot be assigned to deactivated branches</li>
                    <li>This action can be reversed by reactivating the branch</li>
                  </>
                ) : (
                  <li>The branch will be able to receive new parcels once reactivated</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={confirmText}
      destructive={isDeactivating}
    />
  )
}