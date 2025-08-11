import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { filterNavGroupsByRole, navGroups } from './data/sidebar-data'
import { ChevronsUpDown } from 'lucide-react'
import { useAppSelector } from '@/redux/store'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

const { user } = useAppSelector(state => state.auth)

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={sidebarData.teams} /> */}
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
            <ChevronsUpDown className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>
              PDMS
            </span>
            <span className='truncate text-xs'>Delivery Express</span>
          </div>
          {/* <ChevronsUpDown className='ml-auto' /> */}
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {user && user.type === "system" && filterNavGroupsByRole(navGroups, user.role).map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={sidebarData.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
