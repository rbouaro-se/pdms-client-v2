import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PasswordInput } from '@/components/password-input'
import { useAppDispatch } from '@/redux/store'
import { useChangePasswordMutation, useLogoutMutation } from '@/api/slices/auth'
import { IResponse, IAPIError } from '@/types'
import { clearUser } from '@/redux/slices/auth'
import { notifyError, notifySuccess } from '@/components/custom/notify'
import { Loader2 } from 'lucide-react'
import { clearAlert } from '@/redux/slices/notification'
import AuthLayout from '../../auth-layout'

type ActivateAccountFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  temporaryPassword: z
    .string()
    .min(1, 'Please enter your temporary password'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ActivateAccount({ className, ...props }: ActivateAccountFormProps) {

  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temporaryPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    dispatch(clearAlert())

    try {
      const response: IResponse<void> = await changePassword({
        currentPassword: data.temporaryPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      })

      if (!response.error) {
        notifySuccess(dispatch, 'Account Activated', 'Your account has been successfully activated. You can now login with your new password.')
        dispatch(clearUser())
        navigate('/authentication/login')
      } else {
        const error = response.error as IAPIError
        notifyError(dispatch, 'Activation Failed', error.data?.message || 'Failed to activate account. Please check your temporary password.')
      }

    } catch (error) {
      const apiError = error as IAPIError
      notifyError(dispatch, 'Activation Failed', apiError.data?.message || 'Failed to activate account. Please try again later.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/authentication/login", { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthLayout>

      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Account activation
          </CardTitle>
          <CardDescription>
            Activate your account
          </CardDescription>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn('grid gap-4', className)}
              {...props}
            >
              <FormField
                control={form.control}
                name='temporaryPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporary Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter your temporary password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter your new password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Confirm your new password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="mt-2"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating Account...
                  </>
                ) : (
                  'Activate Account'
                )}
              </Button>

              <div className='relative my-2'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background text-muted-foreground px-2'>
                    Already activated?
                  </span>
                </div>
              </div>

              <Button
                className='mt-2'
                variant='outline'
                onClick={handleLogout}
                type="button"
              >
                Go to Login
              </Button>
            </form>
          </Form>

        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
           
          </p>
        </CardFooter>
      </Card>

    </AuthLayout>
  )
}