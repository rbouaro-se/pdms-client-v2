import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { useGetCustomersQuery } from '@/api/slices/customerApiSlice'

export default function Users() {
 
  const { data } = useGetCustomersQuery({
    pageNumber: 0,
    pageSize: 1000,
  });

  console.log(data)

  return (
    <UsersProvider>
      <Header >
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown
            logoutRedirectUrl='/authentication/login'
            profilePageUrl='/pages/admin/settings/profile'
            settingPageUrl='/pages/admin/settings'
          />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          {/* <UsersPrimaryButtons /> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable data={data?.content || []} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
