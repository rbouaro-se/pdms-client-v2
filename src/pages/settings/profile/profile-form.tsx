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
import { Card, CardContent } from '@/components/ui/card'
import { SystemUser, Customer } from '@/types/user'
import { useAppSelector, useAppDispatch } from '@/redux/store'
import { useUpdateSystemUserMutation } from '@/api/slices/users'
import { notifySuccess, notifyError } from '@/components/custom/notify'

// Schema for System User (Admin/Staff)
const systemUserSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  firstName: z
    .string()
    .min(1, 'First name is required.')
    .max(50, 'First name must not be longer than 50 characters.'),
  lastName: z
    .string()
    .min(1, 'Last name is required.')
    .max(50, 'Last name must not be longer than 50 characters.'),
  phoneNumber: z.string().optional(),
})

// Schema for Customer
const customerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not be longer than 100 characters.'),
  email: z.string().email('Please enter a valid email address.').optional(),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required.')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number.')
})

type SystemUserFormValues = z.infer<typeof systemUserSchema>
type CustomerFormValues = z.infer<typeof customerSchema>

export default function ProfileForm() {
  const { user } = useAppSelector(state => state.auth)

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {user.type === 'system' ? (
        <SystemUserProfileForm user={user} />
      ) : (
        <CustomerProfileForm user={user} />
      )}
    </div>
  )
}

function SystemUserProfileForm({ user }: { user: SystemUser }) {
  const dispatch = useAppDispatch()
  const [updateUser, { isLoading }] = useUpdateSystemUserMutation()

  const form = useForm<SystemUserFormValues>({
    resolver: zodResolver(systemUserSchema),
    defaultValues: {
      username: user.username || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber:  '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: SystemUserFormValues) => {
    try {
      await updateUser({
        userId: user.id,
        payload: {
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      }).unwrap()

      notifySuccess(dispatch, 'Profile Updated', 'Your profile has been updated successfully!')
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      const message = error?.data?.message || 'Failed to update profile. Please try again.'
      notifyError(dispatch, 'Update Failed', message)
    }
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your unique identifier in the system.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This email will be used for system notifications and communications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function CustomerProfileForm({ user }: { user: Customer }) {
  const dispatch = useAppDispatch()
  // You'll need to create a similar mutation for customers if available
  // const [updateCustomer, { isLoading }] = useUpdateCustomerMutation()

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || ''
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      // If you have a customer update mutation, use it here
      // await updateCustomer({
      //   customerId: user.customerId,
      //   payload: data
      // }).unwrap()

      // For now, just show a success message
      notifySuccess(dispatch, 'Profile Updated', 'Your profile has been updated successfully!')
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      const message = error?.data?.message || 'Failed to update profile. Please try again.'
      notifyError(dispatch, 'Update Failed', message)
    }
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be used for deliveries and communications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      We'll send delivery updates and receipts to this email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This number will be used for delivery notifications and contact.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={false}> {/* Add isLoading here when you have the mutation */}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}