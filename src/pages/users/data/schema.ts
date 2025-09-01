import { z } from 'zod'

// ========== Shared Enums ==========
export const UserStatusSchema = z.enum([
  'active',
  'inactive',
  'suspended',
  'deleted'
])
export type UserStatus = z.infer<typeof UserStatusSchema>

export const UserRoleSchema = z.enum([
  'admin',
  'agent',
  'customer_service',
  'branch_manager',
])
export type UserRole = z.infer<typeof UserRoleSchema>

// ========== Sub-schemas ==========
const LocationSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  description: z.string().nullable(),
})

const ContactSchema = z.object({
  phoneNumber: z.string(),
  email: z.string(),
})

const BranchSchema = z.object({
  branchId: z.string(),
  name: z.string(),
  location: LocationSchema,
  contact: ContactSchema,
})

// ========== Main Schemas ==========
export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  branch: BranchSchema
})
export type User = z.infer<typeof UserSchema>

// ========== Pagination Schema ==========
export const PaginatedUserSchema = z.object({
  content: z.array(UserSchema),
  page: z.object({
    size: z.number(),
    number: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  }),
})
export type PaginatedUser = z.infer<typeof PaginatedUserSchema>

// ========== List Schema ==========
export const UserListSchema = z.array(UserSchema)
export type UserList = z.infer<typeof UserListSchema>

// ========== Form Schema (for partial updates) ==========
export const UserFormSchema = UserSchema.partial()
export type UserForm = z.infer<typeof UserFormSchema>
