'use client'

import { z } from 'zod'
import { useEffect } from 'react'
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
import type { Branch } from '@/types/parcel'
import LocationPicker from '../../../components/custom/LocationPicker'
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from '@/api/slices/branchApiSlice'

// Zod schema based on CreateBranchRequest
const locationSchema = z.object({
  longitude: z
    .number('Longitude must be a number')
    .min(-180, 'Longitude must be at least -180')
    .max(180, 'Longitude must be at most 180'),
  latitude: z
    .number('Latitude must be a number')
    .min(-90, 'Latitude must be at least -90')
    .max(90, 'Latitude must be at most 90'),
  description: z.string().optional(),
})

const contactSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^233\d{9}$/,
      'Phone number must be a valid Ghanaian number starting with 233. e.g. 233240009009'
    ),
})

const formSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  location: locationSchema,
  contact: contactSchema,
  isEdit: z.boolean(),
})

type BranchForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Branch
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BranchActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow

  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation()
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation()

  const form = useForm<BranchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        name: (currentRow as any)?.name ?? '',
        location: {
          longitude: ((currentRow as any)?.location?.longitude as number) ?? 0,
          latitude: ((currentRow as any)?.location?.latitude as number) ?? 0,
          description: (currentRow as any)?.location?.description ?? '',
        },
        contact: {
          email: (currentRow as any)?.contact?.email ?? '',
          phoneNumber: (currentRow as any)?.contact?.phoneNumber ?? '',
        },
        isEdit: true,
      }
      : {
        name: '',
        location: {
          longitude: 0,
          latitude: 0,
          description: '',
        },
        contact: {
          email: '',
          phoneNumber: '',
        },
        isEdit: false,
      },
  })

  // Keep form in sync when dialog opens or currentRow changes
  useEffect(() => {
    if (open) {
      if (isEdit) {
        form.reset({
          name: (currentRow as any)?.name ?? '',
          location: {
            longitude: ((currentRow as any)?.location?.longitude as number) ?? 0,
            latitude: ((currentRow as any)?.location?.latitude as number) ?? 0,
            description: (currentRow as any)?.location?.description ?? '',
          },
          contact: {
            email: (currentRow as any)?.contact?.email ?? '',
            phoneNumber: (currentRow as any)?.contact?.phoneNumber ?? '',
          },
          isEdit: true,
        })
      } else {
        form.reset({
          name: '',
          location: { longitude: 0, latitude: 0, description: '' },
          contact: { email: '', phoneNumber: '' },
          isEdit: false,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentRow])

  const onSubmit = async (values: BranchForm) => {
    // Prepare payload matching CreateBranchRequest
    const payload = {
      name: values.name,
      location: {
        longitude: values.location.longitude,
        latitude: values.location.latitude,
        description: values.location.description || undefined,
      },
      contact: {
        email: values.contact.email,
        phoneNumber: values.contact.phoneNumber,
      },
    }

    try {
      if (isEdit) {
        // try to infer id property; fall back to branchId if different naming used
        const branchId =
          (currentRow as any)?.id ?? (currentRow as any)?.branchId ?? undefined

        if (!branchId) {
          throw new Error('Unable to determine branch id for update')
        }

        const resp = await updateBranch({ branchId: String(branchId), payload }).unwrap()
        // optional: show response for debugging / confirmation
        showSubmittedData(resp)
      } else {
        const resp = await createBranch(payload as any).unwrap()
        showSubmittedData(resp)
      }

      // close and reset form after success
      form.reset()
      onOpenChange(false)
    } catch (err: any) {
      // Rudimentary error surface; adapt to your toast / notification system
      console.error('Branch save failed', err)
      const message =
        err?.data?.message ?? err?.message ?? 'Failed to save branch. Please try again.'
      // keep it simple: use alert here, replace with toast in your app
      alert(message)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        // when dialog closes via backdrop or close button, reset to initial values
        if (!state) {
          form.reset()
        }
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the branch here. ' : 'Create new branch here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="-mr-4 max-h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
          <Form {...form}>
            <form
              id="branch-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              {/* Branch Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Branch Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Main Branch"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Location Section */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="text-sm font-medium col-span-6">Location</h4>

                <FormField
                  control={form.control}
                  name="location"
                  render={() => (
                    <FormItem className="col-span-6">
                      <FormLabel className="sr-only">Search and pick a location</FormLabel>
                      <LocationPicker
                        value={{
                          latitude: form.getValues('location.latitude'),
                          longitude: form.getValues('location.longitude'),
                          description: form.getValues('location.description') || '',
                        }}
                        onChange={(loc) => {
                          // set nested values individually so zod validation runs on them
                          form.setValue('location.latitude', loc.latitude, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                          form.setValue('location.longitude', loc.longitude, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                          form.setValue('location.description', loc.description ?? '', {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }}
                      />
                      {/* Show validation messages for nested fields */}
                      <div className="mt-2 grid grid-cols-6">
                        <div className="col-span-4 col-start-3">
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Section */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="text-sm font-medium col-span-6">Contact</h4>

                <FormField
                  control={form.control}
                  name="contact.email"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-right">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="branch@company.com"
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.phoneNumber"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-right">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="233240009009"
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit" form="branch-form" disabled={isCreating || isUpdating}>
            {isEdit ? (isUpdating ? 'Updating…' : 'Update Branch') : isCreating ? 'Creating…' : 'Create Branch'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}