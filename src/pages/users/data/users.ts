import { faker } from '@faker-js/faker'
import { UserListSchema, UserRoleSchema } from './schema'
import z from 'zod'

export const generateMockUsers = (count = 20) => {
  const validRoles: z.infer<typeof UserRoleSchema>[] = [
    'admin',
    'agent',
    'customer_service',
    'branch_manager',
  ]

  return Array.from({ length: count }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const branchId = `BR-${faker.string.alphanumeric(6).toUpperCase()}`

    return {
      id: `USR-${faker.string.alphanumeric(6).toUpperCase()}`,
      firstName,
      lastName,
      username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      role: faker.helpers.arrayElement(validRoles), // Only allowed roles
      status: faker.helpers.arrayElement(['active', 'inactive', 'suspended']),
      branch: {
        branchId,
        name: `${faker.company.name()} Branch`,
        location: {
          longitude: faker.location.longitude(),
          latitude: faker.location.latitude(),
          description:
            faker.helpers.maybe(() => faker.location.streetAddress()) || null, // Ensures null if undefined
        },
        contact: {
          phoneNumber: faker.phone.number(),
          email: faker.internet.email({ firstName: 'info' }),
        },
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }
  })
}

// Safe generation with validation
export const getValidMockUsers = (count = 20) => {
  const users = generateMockUsers(count)
  return UserListSchema.parse(users) // Will throw if invalid
}
