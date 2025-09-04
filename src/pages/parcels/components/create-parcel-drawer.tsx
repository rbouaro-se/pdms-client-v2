import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateParcelMutation } from '@/api/slices/parcelApiSlice'
import { useGetAllDispatchersQuery } from '@/api/slices/dispatcherApiSlice'
import { useGetAllBranchesQuery } from '@/api/slices/branchApiSlice'
import { formatPhoneInput, validateGhanaianPhoneNumber } from '@/utils'
import { useEffect } from 'react'


// Zod schema for validation
const formSchema = z.object({
  senderName: z.string().min(1, 'Sender name is required'),
  senderPhoneNumber: z.string()
    .min(1, 'Sender phone is required')
    .refine((value) => {
      const validation = validateGhanaianPhoneNumber(value);
      return validation.isValid;
    }, {
      message: 'Invalid Ghanaian phone number format'
    }),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientPhoneNumber: z.string()
    .min(1, 'Recipient phone is required')
    .refine((value) => {
      const validation = validateGhanaianPhoneNumber(value);
      return validation.isValid;
    }, {
      message: 'Invalid Ghanaian phone number format'
    }),
  deliveryType: z.enum(['STANDARD', 'EXPRESS', 'SAME_DAY']),
  weightKg: z.number().min(0.1, 'Weight must be at least 0.1kg'),
  dimension: z.object({
    lengthCm: z.number().min(1, 'Length must be at least 1cm'),
    widthCm: z.number().min(1, 'Width must be at least 1cm'),
    heightCm: z.number().min(1, 'Height must be at least 1cm'),
  }),
  originBranchId: z.string().min(1, 'Origin branch is required'),
  destinationBranchId: z.string().min(1, 'Destination branch is required'),
  dispatcherId: z.string().min(1, 'Dispatcher is required'),
  parcelType: z.enum(['DOCUMENT', 'PACKAGE', 'FRAGILE', 'PERISHABLE']),
  contentDescription: z.string().min(1, 'Description is required'),
  insuranceValue: z.number().min(0, 'Insurance value cannot be negative'),
  notes: z.string().optional(),
}).refine(data => data.originBranchId !== data.destinationBranchId, {
  message: "Origin and destination branches cannot be the same",
  path: ["destinationBranchId"]
});

type ParcelForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}



export function CreateParcelDrawer({ open, onOpenChange }: Props) {
  const [createParcel] = useCreateParcelMutation()
  const { data: dispatchers } = useGetAllDispatchersQuery({
    pageNumber: 0,
    pageSize: 100,
  });

  const { data: branches } = useGetAllBranchesQuery({
    page: 0,
    size: 100,
  });

  const form = useForm<ParcelForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderName: '',
      senderPhoneNumber: '',
      recipientName: '',
      recipientPhoneNumber: '',
      deliveryType: 'STANDARD',
      weightKg: 0,
      dimension: {
        lengthCm: 0,
        widthCm: 0,
        heightCm: 0,
      },
      originBranchId: '',
      destinationBranchId: '',
      dispatcherId: '',
      parcelType: 'DOCUMENT',
      contentDescription: '',
      insuranceValue: 0,
      notes: '',
    },
  })

  useEffect(() => {
    if (form.watch('originBranchId') === form.watch('destinationBranchId') &&
      form.watch('destinationBranchId')) {
      form.trigger('destinationBranchId');
    }
  }, [form.watch('originBranchId'), form.watch('destinationBranchId')]);

  const handlePhoneChange = (fieldName: 'senderPhoneNumber' | 'recipientPhoneNumber') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formattedValue = formatPhoneInput(rawValue);
      form.setValue(fieldName, formattedValue, { shouldValidate: true });
    };

  const onSubmit = async (data: ParcelForm) => {
    try {

      if (data.originBranchId === data.destinationBranchId) {
        form.setError('destinationBranchId', {
          message: "Origin and destination branches cannot be the same"
        });
        return;
      }

      const payload = {
        ...data,
        senderPhoneNumber: data.senderPhoneNumber.replace(/\D/g, ''),
        recipientPhoneNumber: data.recipientPhoneNumber.replace(/\D/g, ''),
      };
      await createParcel(payload).unwrap()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Failed to create parcel:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>Create New Parcel</SheetTitle>
          <SheetDescription>
            Fill in the parcel details below. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="parcel-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 px-4 overflow-y-auto"
          >
            {/* Sender Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Sender Information</h3>
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Sender name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="233551234567"
                        value={field.value}
                        onChange={handlePhoneChange('senderPhoneNumber')}
                        onBlur={() => form.trigger('senderPhoneNumber')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Recipient Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Recipient Information</h3>
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Recipient name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="233551234567"
                        value={field.value}
                        onChange={handlePhoneChange('recipientPhoneNumber')}
                        onBlur={() => form.trigger('recipientPhoneNumber')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Parcel Details */}
            <div className="space-y-4">
              <h3 className="font-medium">Parcel Details</h3>
              <FormField
                control={form.control}
                name="parcelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcel Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select parcel type"
                      items={[
                        { label: 'Document', value: 'DOCUMENT' },
                        { label: 'Package', value: 'PACKAGE' },
                        { label: 'Fragile', value: 'FRAGILE' },
                        { label: 'Perishable', value: 'PERISHABLE' },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select delivery type"
                      items={[
                        { label: 'Standard', value: 'STANDARD' },
                        { label: 'Express', value: 'EXPRESS' },
                        { label: 'Same Day', value: 'SAME_DAY' },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dimension.lengthCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimension.widthCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimension.heightCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="contentDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Describe the contents" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insuranceValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Logistics */}
            <div className="space-y-4">
              <h3 className="font-medium">Logistics</h3>
              <FormField
                control={form.control}
                name="originBranchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin Branch</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Revalidate destination when origin changes
                        if (value === form.getValues('destinationBranchId')) {
                          form.trigger('destinationBranchId');
                        }
                      }}
                      placeholder="Select origin branch"
                      items={branches?.content
                        .filter(branch => branch.branchId !== form.watch('destinationBranchId'))
                        .map(branch => ({
                          label: branch.name,
                          value: branch.branchId,
                        })) || []}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationBranchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Branch</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Revalidate when destination changes
                        if (value === form.getValues('originBranchId')) {
                          form.trigger('destinationBranchId');
                        }
                      }}
                      placeholder="Select destination branch"
                      items={branches?.content
                        .filter(branch => branch.branchId !== form.watch('originBranchId'))
                        .map(branch => ({
                          label: branch.name,
                          value: branch.branchId,
                        })) || []}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dispatcherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispatcher</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select dispatcher"
                      items={dispatchers?.content.map(dispatcher => ({
                        label: `${dispatcher.agent.firstName} ${dispatcher.agent.lastName} (${dispatcher.dispatcherNumber})`,
                        value: dispatcher.dispatcherId,
                      })) || []}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Special instructions" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button form="parcel-form" type="submit">
            Create Parcel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}