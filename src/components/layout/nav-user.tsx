import {
  User,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { SystemUser } from '@/types/user'

const formatRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    'customer_service': 'Customer Service',
    'branch_manager': 'Manager',
    'admin': 'Admin',
    'agent': 'Agent',
    'customer': 'Customer'
  };

  return roleMap[role] || role.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export function NavUser({
  user,
}: {
  user:SystemUser
}) {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarFallback className='rounded-lg'><User/></AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-bold'>{user.username}</span>
                <span className='truncate text-xs text-muted-foreground'>{formatRoleDisplayName(user.role)}</span>
              </div>
             
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
