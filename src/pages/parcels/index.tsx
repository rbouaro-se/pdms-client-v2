import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { ParcelsPrimaryButtons } from './components/parcels-primary-buttons'
import TasksProvider from './context/tasks-context'
import { useState } from 'react'
import { useSearchParcelsQuery } from '@/api/slices/parcelApiSlice'


export default function Parcels() {
 
  const [page] = useState(0);
  const pageSize = 1000;

  const { data } = useSearchParcelsQuery({
    pageable: { page: page, size:pageSize },
    filter: {},
  });


  return (
    <TasksProvider>
      <Header fixed>
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
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Parcels</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of parcels
            </p>
          </div>
          <ParcelsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable data={data?.content || []} columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
