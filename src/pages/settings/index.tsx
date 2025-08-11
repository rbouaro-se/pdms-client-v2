import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import SidebarNav from './components/sidebar-nav'
import { Outlet } from 'react-router-dom'
import { JSX } from 'react'

interface SidebarNavItem {
  title: string;
  icon: JSX.Element;
  href: string;
  disabled?: boolean;
}

interface SettingsProps {
  title?: string;
  description?: string;
  sidebarNavItems?: SidebarNavItem[];
  children?: React.ReactNode;
}

const DEFAULT_NAV_ITEMS = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/pages/customer/settings/profile',
  },
  {
    title: 'Account',
    icon: <IconTool size={18} />,
    href: '/pages/customer/settings/account',
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: '/settings/notifications',
  },
  {
    title: 'Display',
    icon: <IconBrowserCheck size={18} />,
    href: '/settings/display',
  },
];

export default function Settings({
  title = "Settings",
  description = "Manage your account settings and set e-mail preferences.",
  sidebarNavItems = DEFAULT_NAV_ITEMS,
  children,
}: SettingsProps) {
  return (
    <Main fixed className='container'>
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          {title}
        </h1>
        <p className='text-muted-foreground'>
          {description}
        </p>
      </div>
      <Separator className='my-4 lg:my-6' />
      <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <aside className='top-0 lg:sticky lg:w-1/5'>
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className='flex w-full overflow-y-hidden p-1'>
          {children || <Outlet />}
        </div>
      </div>
    </Main>
  )
}