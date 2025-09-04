import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { branchColumns } from './components/columns'
import { BranchDialogs } from './components/branch-dialogs'
import { BranchPrimaryButtons } from './components/branch-primary-buttons'
import { BranchesTable } from './components/table'
import UsersProvider from './context/branches-context'
import { useGetAllBranchesQuery } from '@/api/slices/branchApiSlice'
import type { Branch } from '@/types/parcel'

export default function Branches() {
  // Fetch all branches (pull a large page — adjust pageSize if necessary)
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllBranchesQuery({
    page: 0,
    size: 1000,
  })

  const branches: Branch[] = data?.content ?? []

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown
            logoutRedirectUrl="/authentication/login"
            profilePageUrl="/pages/admin/settings/profile"
            settingPageUrl="/pages/admin/settings"
          />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Branches</h2>
            <p className="text-muted-foreground">Manage branches</p>
          </div>
          <BranchPrimaryButtons />
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {isLoading || isFetching ? (
            <div className="flex w-full items-center justify-center py-12">
              <span>Loading branches…</span>
            </div>
          ) : isError ? (
            <div className="flex w-full flex-col items-center justify-center py-12">
              <p className="mb-4 text-red-600">
                Failed to load branches{(error as any)?.status ? ` (status: ${(error as any).status})` : ''}.
              </p>
              <button
                onClick={() => refetch()}
                className="rounded-md bg-primary px-4 py-2 text-white"
              >
                Retry
              </button>
            </div>
          ) : (
            <BranchesTable data={branches} columns={branchColumns} />
          )}
        </div>
      </Main>

      <BranchDialogs />
    </UsersProvider>
  )
}