import { z } from 'zod'

// Location schema (similar to LocationDTO)
const locationSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  description: z.string(),
})

// Contact schema (similar to ContactDTO)
const contactSchema = z.object({
  phoneNumber: z.string(),
  email: z.email(),
})

// Branch status schema
// const branchStatusSchema = z.union([
//   z.literal('active'),
//   z.literal('inactive'),
//   z.literal('maintenance'),
// ])
// export type BranchStatus = z.infer<typeof branchStatusSchema>

// Main branch schema
export const branchSchema = z.object({
  branchId: z.string(),
  name: z.string(),
  location: locationSchema,
  contact: contactSchema,
  createdAt: z.coerce.date()
})
export type Branch = z.infer<typeof branchSchema>

// Response schema (matches your BranchResponse record)
export const BranchList = z.array(branchSchema)
