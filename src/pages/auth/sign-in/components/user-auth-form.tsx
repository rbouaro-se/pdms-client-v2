import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { useAppDispatch } from '@/redux/store'
import { useLoginMutation } from '@/api/slices/auth'
import { IResponse } from '@/types'
import { SystemUser } from '@/types/user'
import { setUser } from '@/redux/slices/auth'
import { notifyError } from '@/components/custom/notify'
import { Loader2 } from 'lucide-react'
import { clearAlert } from '@/redux/slices/notification'
type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  
  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const from = location.state?.from?.pathname || '/pages/admin';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
       // eslint-disable-next-line no-console
    dispatch(clearAlert())

    try {
      const response: IResponse<SystemUser> = await login({ usernameOrEmail: data.email, password: data.password })

      if (response.data) {
        dispatch(setUser({ ...response.data, type: "system" }))
        navigate(from, { replace: true })
      } else {
        // const res = response.error as IAPIError
        notifyError(dispatch,'Unauthorized', 'Failed to login! Email or password incorrect.')
      }

    } catch (error) {
      notifyError(dispatch, 'Unauthorized', 'Authentication failed. Please try again later')
    }
  
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/authentication/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
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
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <Button className='mt-2' variant='outline' onClick={() => navigate('/authentication/phone-login')}>
          Phone Login
        </Button>
      </form>
    </Form>
  )
}
