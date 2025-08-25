import { z } from 'zod'

const locationSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  description: z.string().nullable(),
})

const contactSchema = z.object({
  phoneNumber: z.string(),
  email: z.string(),
})

const branchSchema = z.object({
  branchId: z.string(),
  name: z.string(),
  location: locationSchema,
  contact: contactSchema,
})

const personSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
})

const dimensionSchema = z.object({
  lengthCm: z.number(),
  widthCm: z.number(),
  heightCm: z.number(),
})

const deliveryCostSchema = z.object({
  baseFee: z.number(),
  parcelTypeSurcharge: z.number(),
  deliveryTypeSurcharge: z.number(),
  insuranceSurcharge: z.number(),
  deductions: z.number(),
  totalCost: z.number(),
})

const dispatcherSchema = z.object({
  dispatcherId: z.string(),
  dispatcherNumber: z.string(),
  type: z.string(),
  agent: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  available: z.boolean(),
})

export const parcelSchema = z.object({
  parcelId: z.string(),
  status: z.enum([
    'registered',
    'in_transit',
    'available_for_pickup',
    'delivered',
    'returned',
  ]),
  deliveryDate: z.string(),
  origin: branchSchema,
  destination: branchSchema,
  weightKg: z.number(),
  dimension: dimensionSchema,
  parcelType: z.string(),
  deliveryCost: deliveryCostSchema,
  deliveryType: z.string(),
  contentDescription: z.string(),
  sender: personSchema,
  recipient: personSchema,
  dispatcher: dispatcherSchema,
})

export type Parcel = z.infer<typeof parcelSchema>

// For the paginated response
export const parcelsResponseSchema = z.object({
  content: z.array(parcelSchema),
  page: z.object({
    size: z.number(),
    number: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
})

export type ParcelsResponse = z.infer<typeof parcelsResponseSchema>
