'use client'

import { useState } from 'react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { User } from '../data/schema'
import { useSuspendUserMutation, useReinstateUserMutation } from '@/api/slices/users'
import { useAppDispatch } from '@/redux/store'
import { notifySuccess, notifyError } from '@/components/custom/notify'
import { PauseIcon, PlayIcon } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
  action: 'suspend' | 'reinstate' // Add action prop to determine the operation
}

export function UserStatusDialog({ open, onOpenChange, currentRow, action }: Props) {
  const [value, setValue] = useState('')
  const dispatch = useAppDispatch()

  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation()
  const [reinstateUser, { isLoading: isReinstating }] = useReinstateUserMutation()

  const isLoading = isSuspending || isReinstating
  const isSuspension = action === 'suspend'

  const handleStatusChange = async () => {
    if (value.trim() !== currentRow.username) return

    try {
      if (isSuspension) {
        await suspendUser(currentRow.id).unwrap()
        notifySuccess(dispatch, 'User Suspended', `${currentRow.username} has been suspended successfully.`)
        showSubmittedData(currentRow, 'The following user has been suspended:')
      } else {
        await reinstateUser(currentRow.id).unwrap()
        notifySuccess(dispatch, 'User Reinstated', `${currentRow.username} has been reinstated successfully.`)
        showSubmittedData(currentRow, 'The following user has been reinstated:')
      }

      onOpenChange(false)
    } catch (err: any) {
      console.error('Failed to change user status', err)
      const actionText = isSuspension ? 'suspend' : 'reinstate'
      const message = err?.data?.message ?? err?.message ?? `Failed to ${actionText} user. Please try again.`
      notifyError(dispatch, `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} failed`, message)
    }
  }

  const getTitleConfig = () => {
    if (isSuspension) {
      return {
        text: 'Suspend User',
        icon: PauseIcon,
        color: 'text-amber-600 dark:text-amber-500',
        iconColor: 'stroke-amber-600 dark:stroke-amber-500'
      }
    } else {
      return {
        text: 'Reinstate User',
        icon: PlayIcon,
        color: 'text-green-600 dark:text-green-500',
        iconColor: 'stroke-green-600 dark:stroke-green-500'
      }
    }
  }

  const titleConfig = getTitleConfig()
  const IconComponent = titleConfig.icon

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleStatusChange}
      disabled={value.trim() !== currentRow.username || isLoading}
      isLoading={isLoading}
      title={
        <span className={titleConfig.color}>
          <IconComponent
            className={`${titleConfig.iconColor} mr-1 inline-block`}
            size={18}
          />{' '}
          {titleConfig.text}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to {isSuspension ? 'suspend' : 'reinstate'}{' '}
            <span className='font-bold'>{currentRow.username}</span>?
            <br />
            This action will {isSuspension ? 'temporarily disable' : 'restore access for'} the user with the role of{' '}
            <span className='font-bold'>
              {currentRow.role.toUpperCase()}
            </span>{' '}
            {isSuspension ? 'from accessing' : 'to access'} the system.
          </p>

          <Label className='my-2'>
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter username to confirm ${isSuspension ? 'suspension' : 'reinstatement'}.`}
            />
          </Label>

          <Alert variant={isSuspension ? 'destructive' : 'default'} className='mt-4'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              {isSuspension
                ? 'Suspended users will not be able to log in until they are reactivated. This action is reversible.'
                : 'Reinstated users will regain access to the system with their previous permissions.'
              }
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isLoading ? `${isSuspension ? 'Suspending...' : 'Reinstating...'}` : titleConfig.text}
      destructive={isSuspension}
    />
  )
}