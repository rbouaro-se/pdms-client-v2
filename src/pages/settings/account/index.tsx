import { useAppSelector } from '@/redux/store'
import ContentSection from '../components/content-section'
import { AccountManagementForm } from './account-form'
export default function SettingsAccount() {
  const { user } = useAppSelector(state => state.auth)

  return (
    <ContentSection
      title='Account'
      desc='Update your account settings. Set your preferred language and
          timezone.'
    >
      <AccountManagementForm user={user} />
    </ContentSection>
  )
}
