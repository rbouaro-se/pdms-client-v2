import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'
import { ArrowLeft } from 'lucide-react'

interface OtpFormProps {
  title: string
  description: string
  onSubmit: (code: string) => Promise<void>
  onResend?: () => Promise<void>
  onLogout?: () => Promise<void>
  submitButtonText?: string
  resendButtonText?: string
  returnButtonText?: string
  onReturn: () => Promise<void>
}

const formSchema = z.object({
  otp: z.string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'Only numbers are allowed'),
})

export function OtpForm({
  title,
  description,
  onSubmit,
  onResend,
  submitButtonText = 'Verify',
  resendButtonText = 'Resend a new code',
  returnButtonText,
  onReturn
}: OtpFormProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  console.log(title);
  console.log(description);

  const otp = form.watch('otp')
  const isSubmitting = form.formState.isSubmitting

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      await onSubmit(data.otp)
    } catch (error) {
      // Handle error if needed
      console.error('OTP submission error:', error)
    }
  }

  async function handleResend() {
    if (onResend) {
      try {
        await onResend()
      } catch (error) {
        console.error('Resend error:', error)
      }
    }
  }

  async function handleReturn() {
    if (onReturn) {
      try {
        await onReturn()
      } catch (error) {
        console.error('Return error:', error)
      }
    }
  }

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    form.setValue('otp', numericValue, { shouldValidate: true })
  }

  return (
  
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='grid gap-2'
          >
            <FormField
              control={form.control}
              name='otp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='sr-only'>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      onChange={handleInputChange}
                      containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                      disabled={isSubmitting}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='mt-2'
              type='submit'
              disabled={otp.length < 6 || isSubmitting}
              
            >
              {submitButtonText}
            </Button>
      </form>
      <p className='text-muted-foreground px-8 text-center text-sm'>
        Haven't received it?{' '}
        <Button
          variant='link'
          className='hover:text-primary underline underline-offset-4'
          onClick={handleResend}
        >
          {resendButtonText}
        </Button> 

      </p>
      {
        handleReturn && <Button
        variant='link'
        className='text-muted-foreground hover:text-primary underline underline-offset-4'
        onClick={handleReturn}
      >
        <ArrowLeft /> {returnButtonText || 'Go Back'}
      </Button>
      }
       
    </Form>
    
    
    

  )
}