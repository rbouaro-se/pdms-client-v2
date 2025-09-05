import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
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
import { formatGhanaianPhoneNumber, formatPhoneInput, validateGhanaianPhoneNumber } from '@/utils';
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { useInitiatePhoneLoginMutation, useLogoutMutation, usePhoneLoginMutation } from '@/api/slices/auth'
import { OtpForm } from '../otp/components/otp-form'
import { Customer } from '@/types/user'
import { IAPIError, IResponse } from '@/types'
import { setUser } from '@/redux/slices/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { notifyError, notifySuccess } from '@/components/custom/notify'
import ButtonLoading from '@/components/custom/buttonLoading'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  phone: z.string()
    .min(12, 'Phone number must be at least 12 characters long')
    .refine(val => validateGhanaianPhoneNumber(val).isValid, {
      message: 'Please enter a valid Ghanaian phone number'
    })
})

const PhoneLogin = ({ className, ...props }: UserAuthFormProps) => {

  const [searchParams] = useSearchParams();
  const phoneFromParams = searchParams.get('phone') || '';

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation()
  // Initialize step based on URL parameter
  const [step, setStep] = useState<"STEP-1" | "STEP-2">(
    searchParams.get('step') === 'verify' ? "STEP-2" : "STEP-1"
  );

  const { account } = useAppSelector(state => state.registration);

  const [phone, setPhone] = useState<string>(phoneFromParams || account.username || '');

  const [initiatePhoneLogin, { isLoading: isInitiatePhoneLoginLoading }] = useInitiatePhoneLoginMutation();
  const [phoneLogin, { isLoading: isPhoneLoginLoading }] = usePhoneLoginMutation();
  const [logout] = useLogoutMutation();

  React.useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (phone) {
      newParams.set('phone', phone);
    } else {
      newParams.delete('phone');
    }
    navigate(`?${newParams.toString()}`, { replace: true });
  }, [phone]);

  // Update URL when step changes
  React.useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (step === "STEP-2") {
      newParams.set('step', 'verify');
    } else {
      newParams.delete('step');
    }
    navigate(`?${newParams.toString()}`, { replace: true });
  }, [step, navigate, searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: account.username || ''
    },
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    let formattedValue = rawValue;

    // Format as Ghanaian number if starts with 233
    if (rawValue.startsWith('233')) {
      formattedValue = formatPhoneInput(rawValue);
    }

    // Update both form value and local state
    form.setValue('phone', formattedValue, { shouldValidate: true });
    setPhone(formattedValue);
  };
  const from = location.state?.from?.pathname || '/pages/customer';
  const handleSubmit = async (code: string) => {
    try {

      const response: IResponse<Customer> = await phoneLogin({ phoneNumber: phone, otp: code });
      console.log('Phone login successful:', response);

      if (response.data) {
        dispatch(setUser({ ...response.data, type: "customer" }));
        notifySuccess(dispatch, 'Phone Login', 'Phone login successful for ' + response.data.phoneNumber)
        navigate(from, { replace: true });
      }

      if (response.error) {
        const errorResponse = response.error as IAPIError;
        notifyError(dispatch, 'Phone Login', `Authentication failed! ${errorResponse.data.message || 'Unknown error'}`)
      }

    } catch (error) {
      console.error('Verification failed:', error);
      const err = error as Error;
      notifyError(dispatch, 'Phone Login', `Authentication failed! ${err.message || 'Unknown error'}`)
    }
  };

  const handleResend = async () => {
    try {
      initiatePhoneLogin({ phoneNumber: phone })
        .unwrap()
        .then(res => {
          console.log('Phone login initiated:', res);
          notifySuccess(dispatch, 'Phone Login', res.message)
        })
        .catch((error) => {
          console.error('Error initiating phone login:', error);
          const err = error as Error;
          notifyError(dispatch, 'Phone Login', `Error send otp! ${err.message || 'Unknown error'}`)
        });
    } catch (error) {
      console.error('Resend failed:', error);
      // Handle error
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  async function handleContinue(data: z.infer<typeof formSchema>) {
    try {
      const validation = validateGhanaianPhoneNumber(data.phone);
      if (!validation.isValid) {
        form.setError('phone', { message: validation.error || 'Invalid phone number' });
        return;
      }

      const result = await initiatePhoneLogin({ phoneNumber: data.phone }).unwrap();
      console.log('Phone login initiated:', result);
      notifySuccess(dispatch, 'Phone Login', result.message)
      setStep("STEP-2");
    } catch (error) {
      console.error('Error initiating phone login:', error);
      form.setError('phone', {
        message: 'Failed to initiate login. Please try again.'
      });
      const err = error as Error;
      notifyError(dispatch, 'Phone Login', `Error initiating phone login! ${err.message || 'Unknown error'}`)
    }
  }

  const handlReturn = async () => {
    setStep("STEP-1");
    setPhone(phone);
  };

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Login</CardTitle>
          <CardDescription>
            {step === "STEP-1" ?
              "Enter your phone number continue to log into your account" : (<span>Enter the verification code sent to your phone number<br />{formatGhanaianPhoneNumber(searchParams.get('phone') ?? "")}</span>)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'STEP-1' ? (

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleContinue)}
                className={cn('grid gap-3', className)}
                {...props}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="233551234567"
                          value={field.value}
                          onChange={handlePhoneChange}
                          onBlur={() => {
                            // Validate on blur
                            form.trigger('phone');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {
                  isInitiatePhoneLoginLoading ? <ButtonLoading /> :
                    <Button className='mt-2' disabled={isInitiatePhoneLoginLoading} type='submit'>
                      Continue
                    </Button>
                }

                <div className='relative my-2'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background text-muted-foreground px-2'>
                      Or you are an admin?
                    </span>
                  </div>
                </div>

                <Button
                  className='mt-2'
                  variant='outline'
                  type="button"
                  onClick={() => navigate('/authentication/login')}
                >
                  Continue with email and password
                </Button>
              </form>
            </Form>

          ) : (
            <OtpForm
              title="Phone Login Verification"
              description={`Please enter the verification code sent to ${formatGhanaianPhoneNumber(phone)}`}
              onSubmit={handleSubmit}
              onResend={handleResend}
              onLogout={handleLogout}
              onReturn={handlReturn}
              returnButtonText="Enter a different phone number"
              submitButtonText="Verify Code"
                resendButtonText="Send new code"
                isLoading={isPhoneLoginLoading}
            />
          )}

        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking login, you agree to our{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}

export default PhoneLogin
