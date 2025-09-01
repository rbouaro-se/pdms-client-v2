'use client'

import { useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { userTypes } from '../data/data'
import { User } from '../data/schema'
import { useGetAllBranchesQuery } from '@/api/slices/branchApiSlice'
import { Branch } from '@/types/parcel'
import { IconMailPlus, IconSend } from '@tabler/icons-react'
import { useRegisterSystemUserMutation, useUpdateSystemUserMutation } from '@/api/slices/users'
import { useAppDispatch } from '@/redux/store'
import { notifySuccess, notifyError } from '@/components/custom/notify'
import { UserRole } from '@/types/user'

const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required.'),
  lastName: z.string().min(1, 'Last Name is required.'),
  username: z.string().min(1, 'Username is required.'),
  phoneNumber: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(1, 'Role is required.'),
  branchId: z.string().optional(),
  isEdit: z.boolean(),
})

type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const dispatch = useAppDispatch()

  // User mutations
  const [registerUser, { isLoading: isRegistering }] = useRegisterSystemUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateSystemUserMutation()

  // Fetch branches
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(
    useMemo(() => ({ size: 100, page: 0 }), [])
  )

  const branches = branchesData?.content || []
  const branchItems = branches.map((branch: Branch) => ({
    label: branch.name,
    value: branch.branchId,
  }))

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        firstName: currentRow?.firstName || '',
        lastName: currentRow?.lastName || '',
        username: currentRow?.username || '',
        email: currentRow?.email || '',
        role: currentRow?.role || '',
        phoneNumber: '',
        branchId: currentRow?.branch?.branchId || '',
        isEdit: true,
      }
      : {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: '',
        phoneNumber: '',
        branchId: '',
        isEdit: false,
      },
  })

  const onSubmit = async (values: UserForm) => {
    try {
      if (isEdit && currentRow?.id) {
        // Update existing user
        const updatePayload = {
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          role: values.role as UserRole,
          branchId: values.branchId,
        }

        await updateUser({
          userId: currentRow.id,
          payload: updatePayload
        }).unwrap()

        console.log("payload", updatePayload)

        notifySuccess(dispatch, 'User updated', `${values.firstName} ${values.lastName} has been updated successfully.`)
      } else {
        // Register new user (invite)
        const registerPayload = {
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          role: values.role as UserRole,
          branchId: values.branchId || '',
        }

        await registerUser(registerPayload).unwrap()

        notifySuccess(dispatch, 'Invitation sent', `Invitation has been sent to ${values.email}.`)
      }

      form.reset()
      onOpenChange(false)
      showSubmittedData(values)
    } catch (err: any) {
      console.error('Failed to save user', err)
      const message = err?.data?.message ?? err?.message ?? 'Failed to save user. Please try again.'
      notifyError(dispatch, isEdit ? 'Update failed' : 'Invitation failed', message)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          {isEdit ?
            (
              <>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update the user here. Click save when you&apos;re done.
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle className='flex items-center gap-2'>
                  <IconMailPlus /> Invite User
                </DialogTitle>
                <DialogDescription>
                  Invite new user to join by sending them an email
                  invitation. Assign a role to define their access level.
                </DialogDescription>
              </>
            )}
        </DialogHeader>
        <div className='-mr-4 max-h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john_doe'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                        disabled={isEdit} // Email shouldn't be editable
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+123456789 (optional)'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Role
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a role'
                      className='col-span-4'
                      items={userTypes.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='branchId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Branch
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={branchesLoading ? 'Loading branches...' : 'Select a branch (optional)'}
                      className='col-span-4'
                      items={branchItems}
                      disabled={branchesLoading}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='user-form'
            disabled={isRegistering || isUpdating}
          >
            {isRegistering || isUpdating ? (
              'Processing...'
            ) : isEdit ? (
              'Save changes'
            ) : (
              <>
                Invite <IconSend className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}