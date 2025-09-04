import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect } from 'react'
import { useGetConfigurationQuery, useUpdateConfigurationMutation } from '@/api/slices/configurationApiSlice'
import { useAppDispatch } from '@/redux/store'
import { notifyError, notifySuccess } from '@/components/custom/notify'

const deliveryConfigFormSchema = z.object({
  // === Limits ===
  maxParcelWeightKg: z.number()
    .min(0.01, 'Max parcel weight must be greater than 0')
    .max(99999.99, 'Max parcel weight cannot exceed 99999.99 kg'),

  maxParcelDimensionCm: z.number()
    .min(0.01, 'Max parcel dimension must be greater than 0')
    .max(99999.99, 'Max parcel dimension cannot exceed 99999.99 cm'),

  maxInsuranceValue: z.number()
    .min(0, 'Max insurance value cannot be negative')
    .max(99999999.99, 'Max insurance value cannot exceed 99,999,999.99'),

  // === Delivery cost ===
  flatDeliveryCost: z.number()
    .min(0, 'Flat delivery cost cannot be negative')
    .max(999999.99, 'Flat delivery cost cannot exceed 999,999.99'),

  deliveryBaseCost: z.number()
    .min(0, 'Delivery base cost cannot be negative')
    .max(999999.99, 'Delivery base cost cannot exceed 999,999.99'),

  deliveryCostPerKg: z.number()
    .min(0, 'Delivery cost per kg cannot be negative')
    .max(9999.99, 'Delivery cost per kg cannot exceed 9,999.99'),

  insurancePercentage: z.number()
    .min(0, 'Insurance percentage cannot be negative')
    .max(999.99, 'Insurance percentage cannot exceed 999.99%'),

  ratePerDeliveryDistanceKm: z.number()
    .min(0, 'Rate per delivery distance cannot be negative')
    .max(9999.99, 'Rate per delivery distance cannot exceed 9,999.99'),

  // === Feature Toggles ===
  useFlatDeliveryCost: z.boolean(),
  useFlatDeliveryTypeFee: z.boolean(),
  useFlatParcelTypeFee: z.boolean(),

  // === ParcelType Base Fees ===
  flatParcelTypeFee: z.number()
    .min(0, 'Flat parcel type fee cannot be negative')
    .max(999999.99, 'Flat parcel type fee cannot exceed 999,999.99'),

  documentParcelTypeSurcharge: z.number()
    .min(0, 'Document parcel type surcharge cannot be negative')
    .max(999999.99, 'Document parcel type surcharge cannot exceed 999,999.99'),

  fragileParcelTypeSurcharge: z.number()
    .min(0, 'Fragile parcel type surcharge cannot be negative')
    .max(999999.99, 'Fragile parcel type surcharge cannot exceed 999,999.99'),

  oversizeParcelTypeSurcharge: z.number()
    .min(0, 'Oversize parcel type surcharge cannot be negative')
    .max(999999.99, 'Oversize parcel type surcharge cannot exceed 999,999.99'),

  perishableParcelTypeSurcharge: z.number()
    .min(0, 'Perishable parcel type surcharge cannot be negative')
    .max(999999.99, 'Perishable parcel type surcharge cannot exceed 999,999.99'),

  electronicsParcelTypeSurcharge: z.number()
    .min(0, 'Electronics parcel type surcharge cannot be negative')
    .max(999999.99, 'Electronics parcel type surcharge cannot exceed 999,999.99'),

  clothingParcelTypeSurcharge: z.number()
    .min(0, 'Clothing parcel type surcharge cannot be negative')
    .max(999999.99, 'Clothing parcel type surcharge cannot exceed 999,999.99'),

  furnitureParcelTypeSurcharge: z.number()
    .min(0, 'Furniture parcel type surcharge cannot be negative')
    .max(999999.99, 'Furniture parcel type surcharge cannot exceed 999,999.99'),

  otherParcelTypeSurcharge: z.number()
    .min(0, 'Other parcel type surcharge cannot be negative')
    .max(999999.99, 'Other parcel type surcharge cannot exceed 999,999.99'),

  // === DeliveryType Surcharge Rates ===
  flatDeliveryTypeFee: z.number()
    .min(0, 'Flat delivery type fee cannot be negative')
    .max(999999.99, 'Flat delivery type fee cannot exceed 999,999.99'),

  expressDeliverySurcharge: z.number()
    .min(0, 'Express delivery surcharge cannot be negative')
    .max(999.99, 'Express delivery surcharge cannot exceed 999.99'),

  standardDeliverySurcharge: z.number()
    .min(0, 'Standard delivery surcharge cannot be negative')
    .max(999.99, 'Standard delivery surcharge cannot exceed 999.99'),

  regularDeliverySurcharge: z.number()
    .min(0, 'Regular delivery surcharge cannot be negative')
    .max(999.99, 'Regular delivery surcharge cannot exceed 999.99'),

  sameDayDeliverySurcharge: z.number()
    .min(0, 'Same day delivery surcharge cannot be negative')
    .max(999.99, 'Same day delivery surcharge cannot exceed 999.99'),

  // === Delivery Windows ===
  expressDeliveryWindow: z.number()
    .min(1, 'Express delivery window must be at least 1 hour')
    .max(8760, 'Express delivery window cannot exceed 8760 hours (1 year)'),

  standardDeliveryWindow: z.number()
    .min(1, 'Standard delivery window must be at least 1 hour')
    .max(8760, 'Standard delivery window cannot exceed 8760 hours (1 year)'),

  regularDeliveryWindow: z.number()
    .min(1, 'Regular delivery window must be at least 1 hour')
    .max(8760, 'Regular delivery window cannot exceed 8760 hours (1 year)'),

  sameDayDeliveryWindow: z.number()
    .min(1, 'Same day delivery window must be at least 1 hour')
    .max(24, 'Same day delivery window cannot exceed 24 hours'),
})

type DeliveryConfigFormValues = z.infer<typeof deliveryConfigFormSchema>

const defaultValues: Partial<DeliveryConfigFormValues> = {
  maxParcelWeightKg: 50,
  maxParcelDimensionCm: 200,
  maxInsuranceValue: 10000,
  flatDeliveryCost: 10,
  deliveryBaseCost: 5,
  deliveryCostPerKg: 2,
  insurancePercentage: 1.5,
  ratePerDeliveryDistanceKm: 0.5,
  useFlatDeliveryCost: false,
  useFlatDeliveryTypeFee: false,
  useFlatParcelTypeFee: false,
  flatParcelTypeFee: 0,
  documentParcelTypeSurcharge: 0,
  fragileParcelTypeSurcharge: 5,
  oversizeParcelTypeSurcharge: 10,
  perishableParcelTypeSurcharge: 3,
  electronicsParcelTypeSurcharge: 8,
  clothingParcelTypeSurcharge: 0,
  furnitureParcelTypeSurcharge: 15,
  otherParcelTypeSurcharge: 2,
  flatDeliveryTypeFee: 0,
  expressDeliverySurcharge: 25,
  standardDeliverySurcharge: 10,
  regularDeliverySurcharge: 0,
  sameDayDeliverySurcharge: 40,
  expressDeliveryWindow: 24,
  standardDeliveryWindow: 72,
  regularDeliveryWindow: 168,
  sameDayDeliveryWindow: 8,
}

export function PaDeliveryConfigurationForm() {
  const { data: configuration, isLoading, error } = useGetConfigurationQuery()
  const [updateConfiguration, { isLoading: isUpdating }] = useUpdateConfigurationMutation()

  const form = useForm<DeliveryConfigFormValues>({
    resolver: zodResolver(deliveryConfigFormSchema),
    defaultValues,
  })
  const dispatch = useAppDispatch()
 
  useEffect(() => {
    if (configuration) {
      form.reset(configuration)
    }
  }, [configuration, form])

  const onSubmit = async (data: DeliveryConfigFormValues) => {
    try {
      await updateConfiguration(data).unwrap()
      notifySuccess(dispatch, 'Delivery configuration has been updated successfully.')
    } catch (error) {
      notifyError(dispatch, 'Failed to update delivery configuration.')
    }
  }

  if (isLoading) {
    return <div>Loading configuration...</div>
  }

  if (error) {
    return <div>Error loading configuration</div>
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        {/* Limits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Parcel Limits</CardTitle>
            <CardDescription>Configure maximum parcel dimensions and insurance limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="maxParcelWeightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Parcel Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Maximum allowed weight for a single parcel</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxParcelDimensionCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Parcel Dimension (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Maximum allowed dimension (length + width + height)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxInsuranceValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Insurance Value ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Maximum insurance coverage per parcel</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Cost Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Cost Structure</CardTitle>
            <CardDescription>Configure base delivery costs and pricing models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="useFlatDeliveryCost"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Use Flat Delivery Cost</FormLabel>
                    <FormDescription>
                      Charge a fixed rate regardless of weight or distance
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {form.watch('useFlatDeliveryCost') ? (
                <FormField
                  control={form.control}
                  name="flatDeliveryCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flat Delivery Cost ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="deliveryBaseCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Delivery Cost ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Fixed base cost for all deliveries</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryCostPerKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost per Kg ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ratePerDeliveryDistanceKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate per Km ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="insurancePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Percentage (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Percentage of declared value charged for insurance</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Parcel Type Fees Section */}
        <Card>
          <CardHeader>
            <CardTitle>Parcel Type Surcharges</CardTitle>
            <CardDescription>Configure additional fees for different parcel types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="useFlatParcelTypeFee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Use Flat Parcel Type Fee</FormLabel>
                    <FormDescription>
                      Charge a fixed rate for all parcel types instead of individual surcharges
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('useFlatParcelTypeFee') ? (
              <FormField
                control={form.control}
                name="flatParcelTypeFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flat Parcel Type Fee ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Fixed fee applied to all parcel types</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="documentParcelTypeSurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documents ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fragileParcelTypeSurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fragile Items ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oversizeParcelTypeSurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oversize Items ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="perishableParcelTypeSurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perishable Goods ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="electronicsParcelTypeSurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Electronics ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clothingParcelTypeSurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clothing ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="furnitureParcelTypeSurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Furniture ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherParcelTypeSurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Items ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Type Surcharges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Type Surcharges</CardTitle>
            <CardDescription>Configure additional fees for different delivery speeds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="useFlatDeliveryTypeFee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Use Flat Delivery Type Fee</FormLabel>
                    <FormDescription>
                      Charge a fixed rate for all delivery types instead of individual surcharges
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('useFlatDeliveryTypeFee') ? (
              <FormField
                control={form.control}
                name="flatDeliveryTypeFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flat Delivery Type Fee ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Fixed fee applied to all delivery types</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="expressDeliverySurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Express Delivery (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Percentage surcharge for express delivery</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="standardDeliverySurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard Delivery (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Percentage surcharge for standard delivery</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="regularDeliverySurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Delivery (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Percentage surcharge for regular delivery</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sameDayDeliverySurcharge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Same Day Delivery (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Percentage surcharge for same day delivery</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Windows Section */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Time Windows</CardTitle>
            <CardDescription>Configure maximum delivery time for each service type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="expressDeliveryWindow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Express Delivery (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Maximum delivery time for express service</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="standardDeliveryWindow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Delivery (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Maximum delivery time for standard service</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="regularDeliveryWindow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regular Delivery (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Maximum delivery time for regular service</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sameDayDeliveryWindow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Same Day Delivery (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Maximum delivery time for same day service (must be ≤ 24 hours)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={isUpdating}>
          {isUpdating ? 'Saving...' : 'Save Configuration'}
        </Button>
      </form>
    </Form>
  )
}