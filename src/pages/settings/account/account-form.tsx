import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/password-input';
import { AppUser } from '@/types/user';
import { useChangePasswordMutation } from '@/api/slices/auth';
import { useAppDispatch } from '@/redux/store';
import { notifySuccess, notifyError } from '@/components/custom/notify';

// Password change schema
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Email preferences schema
// const emailPreferencesSchema = z.object({
//   marketingEmails: z.boolean(),
//   securityAlerts: z.boolean(),
//   orderUpdates: z.boolean(),
//   newsletter: z.boolean(),
// }).refine(
//   (data) => data.marketingEmails || data.securityAlerts || data.orderUpdates || data.newsletter,
//   {
//     message: 'At least one email preference must be selected',
//     path: ['marketingEmails'],
//   }
// );

// // Two-factor authentication schema
// const twoFactorSchema = z.object({
//   enable2FA: z.boolean(),
// });

type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
// type EmailPreferencesValues = z.infer<typeof emailPreferencesSchema>;
// type TwoFactorValues = z.infer<typeof twoFactorSchema>;

interface AccountManagementFormProps {
  user: AppUser | null;
}

export function AccountManagementForm({ user }: AccountManagementFormProps) {
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const passwordForm = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // const emailForm = useForm<EmailPreferencesValues>({
  //   resolver: zodResolver(emailPreferencesSchema),
  //   defaultValues: {
  //     marketingEmails: false,
  //     securityAlerts: true,
  //     orderUpdates: true,
  //     newsletter: false,
  //   },
  // });

  // const twoFactorForm = useForm<TwoFactorValues>({
  //   resolver: zodResolver(twoFactorSchema),
  //   defaultValues: {
  //     enable2FA: false,
  //   },
  // });

  const onPasswordSubmit = async (data: PasswordChangeValues) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      }).unwrap();

      notifySuccess(dispatch, 'Password Changed', 'Your password has been updated successfully!');
      passwordForm.reset();
    } catch (error: any) {
      console.error('Failed to change password:', error);
      const message = error?.data?.message || 'Failed to change password. Please try again.';
      notifyError(dispatch, 'Password Change Failed', message);
    }
  };

  // const onEmailPreferencesSubmit = (_data: EmailPreferencesValues) => {

  // };

  // const onTwoFactorSubmit = (_data: TwoFactorValues) => {
  
  // };

  // For customers without an email, show a message
  if (user && user.type === 'customer' && !user.email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>
            Manage what types of emails you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No email address is associated with this account. Please update your account with an email address to manage email preferences.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Password Change Section (SystemUser only) */}
      {user && user.type === 'system' && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Enter your current password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your existing password for verification before changing it.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Enter your new password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Must be at least 8 characters with uppercase, lowercase, number, and special character
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Confirm your new password"
                            {...field}
                          />

                        </FormControl>
                        <FormDescription>
                          Re-enter your new password to confirm it matches.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isChangingPassword || passwordForm.formState.isSubmitting}
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Email Preferences Section (both SystemUser and Customer) */}
      {/* {user && user.type === 'system' && <Separator />}
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>
            Manage what types of emails you want to receive at {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailPreferencesSubmit)}
              className="space-y-4"
            >
              {user && user.type === 'system' && (
                <FormField
                  control={emailForm.control}
                  name="securityAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Security Alerts</FormLabel>
                        <FormDescription>
                          Important notifications about your account security
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={emailForm.control}
                name="orderUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Order Updates</FormLabel>
                      <FormDescription>
                        Notifications about your parcel deliveries
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="marketingEmails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Marketing Emails</FormLabel>
                      <FormDescription>
                        Promotions, offers, and company news
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Newsletter</FormLabel>
                      <FormDescription>
                        Weekly updates and industry insights
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormMessage />
              <Button type="submit" disabled={emailForm.formState.isSubmitting}>
                Save Preferences
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card> */}

      {/* Two-Factor Authentication Section (SystemUser only) */}
      {/* {user && user.type === 'system' && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...twoFactorForm}>
                <form onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)} className="space-y-4">
                  <FormField
                    control={twoFactorForm.control}
                    name="enable2FA"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable 2FA</FormLabel>
                          <FormDescription>
                            Require a verification code from your authenticator app when signing in
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {twoFactorForm.watch('enable2FA') && (
                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="font-medium mb-2">Setup Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        Download an authenticator app like Google Authenticator or Authy and scan the QR code that will be shown after enabling 2FA.
                      </p>
                    </div>
                  )}
                  <Button type="submit" disabled={twoFactorForm.formState.isSubmitting}>
                    {twoFactorForm.watch('enable2FA') ? 'Disable 2FA' : 'Enable 2FA'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )} */}
    </div>
  );
}