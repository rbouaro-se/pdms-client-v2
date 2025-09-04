import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { useAppDispatch } from '@/redux/store'
import {
  useInitiatePasswordResetMutation,
  useConfirmPasswordResetMutation,
  useResetPasswordMutation
} from '@/api/slices/auth'
import { setFeedback } from '@/redux/slices/notification'
import { IAPIError } from '@/types'
import React from 'react'
import { OtpForm } from '../otp/components/otp-form'
import { notifyError, notifySuccess } from '@/components/custom/notify'
import { PasswordInput } from '@/components/password-input'

type ForgotPasswordFormProps = HTMLAttributes<HTMLFormElement>

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ForgotPassword({ className, ...props }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get('email') || '';

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Initialize step based on URL parameter
  const [step, setStep] = useState<"EMAIL" | "OTP" | "PASSWORD">(
    searchParams.get('step') === 'otp' ? "OTP" :
      searchParams.get('step') === 'password' ? "PASSWORD" : "EMAIL"
  );

  const [email, setEmail] = useState<string>(emailFromParams);

  const [initiatePasswordReset] = useInitiatePasswordResetMutation();
  const [confirmPasswordReset] = useConfirmPasswordResetMutation();
  const [resetPassword] = useResetPasswordMutation();

  // Update URL when email changes
  React.useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (email) {
      newParams.set('email', email);
    } else {
      newParams.delete('email');
    }
    navigate(`?${newParams.toString()}`, { replace: true });
  }, [email]);

  // Update URL when step changes
  React.useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (step === "OTP") {
      newParams.set('step', 'otp');
    } else if (step === "PASSWORD") {
      newParams.set('step', 'password');
    } else {
      newParams.delete('step');
    }
    navigate(`?${newParams.toString()}`, { replace: true });
  }, [step, navigate, searchParams]);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: emailFromParams
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
  })

  const handleSubmitEmail = async (data: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      const response: { message: string } = await initiatePasswordReset({
        email: data.email
      }).unwrap();

      console.log('Password reset initiated:', response);
      setEmail(data.email);
      setStep("OTP");

     notifySuccess(dispatch, "Account Recovery", response.message)

    } catch (error) {
      console.error('Error initiating password reset:', error);
      const apiError = error as IAPIError;
      dispatch(setFeedback({
        message: apiError.data?.message || 'Failed to send verification code',
        title: "Password Reset",
        color: "danger"
      }))
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmitOtp = async (code: string) => {
    setIsLoading(true);
    try {
      const response: { message: string } = await confirmPasswordReset({
        otp: code
      }).unwrap();

      console.log('OTP verified:', response);
      setStep("PASSWORD");

      notifySuccess(dispatch, "Account Recovery", response.message)

    } catch (error) {
      console.error('Error verifying OTP:', error);
      const apiError = error as IAPIError;
      notifyError(dispatch, "Account Recovery", apiError.data.message)
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetPassword = async (data: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const response: { message: string } = await resetPassword({
        newPassword: data.password,
        confirmPassword: data.confirmPassword
      }).unwrap();

      console.log('Password reset successful:', response);

      notifySuccess(dispatch, "Account Recovery", response.message)

      navigate('/authentication/', { replace: true });

    } catch (error) {
      console.error('Error resetting password:', error);
      const apiError = error as IAPIError;
      notifyError(dispatch, "Account Recovery", apiError.data.message)
    } finally {
      setIsLoading(false);
    }
  }

  const handleBack = () => {
    if (step === "OTP") {
      setStep("EMAIL");
    } else if (step === "PASSWORD") {
      setStep("OTP");
    }
  }

  const handleResendOtp = async () => {
    try {
      await initiatePasswordReset({ email }).unwrap();
      dispatch(setFeedback({
        message: `New verification code sent to ${email}`,
        title: "Password Reset",
        color: "success"
      }))
    } catch (error) {
      const apiError = error as IAPIError;
      dispatch(setFeedback({
        message: apiError.data?.message || 'Failed to resend code',
        title: "Password Reset",
        color: "danger"
      }))
    }
  }

  const handleReturnToEmail = async () => {
    setStep("EMAIL");
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Forgot Password
          </CardTitle>
          <CardDescription>
            {step === "EMAIL"
              ? "Enter your registered email to receive a verification code"
              : step === "OTP"
                ? `Enter the verification code sent to ${email}`
                : "Set your new password"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'EMAIL' ? (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleSubmitEmail)}
                className={cn('grid gap-3', className)}
                {...props}
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setEmail(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className='mt-2' disabled={isLoading} type='submit'>
                  Send Verification Code
                </Button>
              </form>
            </Form>
          ) : step === 'OTP' ? (
            <OtpForm
              title="Password Reset Verification"
              description={`Please enter the verification code sent to ${email}`}
              onSubmit={handleSubmitOtp}
              onResend={handleResendOtp}
              onReturn={handleReturnToEmail}
              returnButtonText="Enter a different email"
              submitButtonText="Verify Code"
              resendButtonText="Send new code"
            />
          ) : (
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handleResetPassword)}
                className={cn('grid gap-4', className)}
                {...props}
              >
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm your new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            {step === "EMAIL" ? (
              <>Remember your password?{' '}
                <Link
                  to='/authentication/login'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Login
                </Link>
              </>
            ) : step === "OTP" ? (
              <>Didn't receive the code?{' '}
                <Button
                  variant="link"
                  className='p-0 h-auto text-sm'
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Resend code
                </Button>
              </>
            ) : null}
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}