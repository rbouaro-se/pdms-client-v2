'use client'

import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/statuses'
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
import { Switch } from '@/components/ui/switch'
import { notifySuccess, notifyError } from '@/components/custom/notify'
import { useAppDispatch } from '@/redux/store'
import { SystemUser, UserRole } from '@/types/user'
import { Agent, Dispatcher } from '@/types/dispatcher'
import { useSearchUsersMutation } from '@/api/slices/users'
import {
  useCreateDispatcherMutation,
  useUpdateDispatcherMutation,
} from '@/api/slices/dispatcherApiSlice'
import { DispatcherType } from '@/types/parcel'

const dispatcherTypes = [
  { value: 'van', label: 'Van' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'bus', label: 'Bus' },
  { value: 'truck', label: 'Truck' },
] as const

const formSchema = z.object({
  dispatcherNumber: z
    .string()
    .min(3, 'Dispatcher number must be at least 3 characters')
    .max(100, 'Dispatcher number must be at most 100 characters'),
  type: z.enum(['van', 'motorcycle', 'bus', 'truck'] as const).refine(
    (val) => val !== undefined,
    {
      message: 'Please select a valid dispatcher type',
    }
  ),
  agentId: z.string().min(1, 'Please select an agent'),
  available: z.boolean().optional(),
  isEdit: z.boolean(),
})

type DispatcherForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Dispatcher
  open: boolean
  onOpenChange: (open: boolean) => void
  agents?: Agent[]
}

export function DispatchersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const dispatch = useAppDispatch()

  const form = useForm<DispatcherForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        dispatcherNumber: currentRow?.dispatcherNumber || '',
        type: currentRow?.type as DispatcherType,
        agentId: currentRow?.agent?.agentId || '',
        available: currentRow?.available ?? true,
        isEdit: true,
      }
      : {
        dispatcherNumber: '',
        type: undefined,
        agentId: '',
        available: true,
        isEdit: false,
      },
  })

  // Use userApiSlice.searchUsers to fetch system users with role "agent"
  const [searchUsersTrigger] = useSearchUsersMutation()
  const [agents, setAgents] = useState<SystemUser[]>([])
  const [agentsLoading, setAgentsLoading] = useState(false)
  const [agentSearch, setAgentSearch] = useState<string>('')

  // dispatcher mutations
  const [createDispatcher, { isLoading: isCreating }] = useCreateDispatcherMutation()
  const [updateDispatcher, { isLoading: isUpdating }] = useUpdateDispatcherMutation()

  // prepare pageable: fetch a reasonable number
  const pageable = useMemo(() => ({ size: 200, page: 0 }), [])

  // fetch agents by role filter; trigger when dialog opens and optionally when user types search
  useEffect(() => {
    let mounted = true
    const fetchAgents = async () => {
      setAgentsLoading(true)
      try {
        const payload = {
          pageable,
          search: agentSearch || undefined,
          filter: { roles: ['agent' as UserRole] },
        }
        const res = await searchUsersTrigger(payload).unwrap()
        if (mounted && res?.content) {
          setAgents(res.content as SystemUser[])
        }
      } catch (err) {
        notifyError(dispatch, 'Failed to load agents', 'Unable to fetch agents. Please try again later.')
      } finally {
        if (mounted) setAgentsLoading(false)
      }
    }

    if (open) {
      fetchAgents()
    } else {
      setAgentSearch('')
    }

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, agentSearch, searchUsersTrigger, dispatch])

  const agentItems = agents.map((a) => ({
    label: `${a.firstName} ${a.lastName}${a.email ? ` — ${a.email}` : ''}`,
    value: a.id,
  }))

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (values: DispatcherForm) => {
    setIsSubmitting(true)

    const payload = {
      dispatcherNumber: values.dispatcherNumber,
      type: values.type,
      agentId: values.agentId,
      available: values.available ?? true,
    }

    console.log('Submitting dispatcher form', { isEdit, payload, values })

    try {
      if (isEdit && currentRow && currentRow.dispatcherId) {
        console.log('Updating dispatcher', currentRow.dispatcherId, payload)
        await updateDispatcher({ dispatcherId: currentRow.dispatcherId, payload }).unwrap()
        notifySuccess(dispatch, 'Dispatcher updated', `${values.dispatcherNumber} has been updated.`)
      } else {
        // use RTK Query mutation for create
        await createDispatcher(payload).unwrap()
        notifySuccess(dispatch, 'Dispatcher created', `${values.dispatcherNumber} has been added.`)
      }

      // reset & close dialog on success
      form.reset()
      onOpenChange(false)
      showSubmittedData(payload, isEdit ? 'Updated dispatcher:' : 'Created dispatcher:')
    } catch (err: any) {
      console.error('Failed to create/update dispatcher', err)
      const message = err?.data?.message ?? err?.message ?? 'Failed to save dispatcher. Please try again.'
      notifyError(dispatch, isEdit ? 'Update failed' : 'Create failed', message)
      // keep dialog open so user can correct things
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset({
            dispatcherNumber: currentRow?.dispatcherNumber || '',
            type: currentRow?.type as DispatcherType,
            agentId: currentRow?.agent.agentId || '',
            available: currentRow?.available ?? true,
            isEdit: !!currentRow,
          })
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Dispatcher' : 'Add New Dispatcher'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update dispatcher availability. Other details cannot be modified.'
              : "Create a new dispatcher. Click save when you're done."
            }
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 max-h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='dispatcher-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='dispatcherNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Dispatcher Identity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='GR 2909-24'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Vehicle Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select vehicle type'
                      className='col-span-4'
                      items={dispatcherTypes.map(({ label, value }) => ({ label, value }))}
                      disabled={isEdit}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {isEdit ? (
                // Display only in edit mode - disabled but showing the value
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-right'>Assigned Agent</FormLabel>
                  <div className='col-span-4'>
                    <Input
                      value={`${currentRow.agent.firstName} ${currentRow.agent.lastName}` || 'Agent not found'}
                      className='w-full'
                      disabled
                    />
                  </div>
                </FormItem>
                  
              ) : (
                // Create mode - editable field
                <FormField
                  control={form.control}
                  name='agentId'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-right'>Assigned Agent</FormLabel>
                      <div className='col-span-4 space-y-1'>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={agentsLoading ? 'Loading agents…' : 'Select an agent'}
                          className='w-full'
                          items={agentItems}
                          disabled={agentsLoading}
                        />
                        <Input
                          placeholder='Search agents by name or email'
                          value={agentSearch}
                          onChange={(e) => setAgentSearch(e.target.value)}
                          className='mt-1'
                        />
                      </div>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='available'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Availability</FormLabel>
                    <div className='col-span-4 flex items-center gap-2'>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <span className='text-sm'>{field.value ? 'Available' : 'Unavailable'}</span>
                    </div>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='dispatcher-form' disabled={isSubmitting || isCreating || isUpdating}>
            {isSubmitting || isCreating || isUpdating ? (isEdit ? 'Saving…' : 'Creating…') : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}