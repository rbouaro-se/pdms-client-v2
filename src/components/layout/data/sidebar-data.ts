import { IconLayoutDashboard, IconUsersGroup, IconPackages, IconTruckDelivery, IconUsers } from '@tabler/icons-react';
import { UserRole } from '@/types/user';
import { Settings2Icon, Split } from 'lucide-react';
import { NavGroup } from '../types';


export const navGroups: NavGroup[] = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        url: '/pages/admin/dashboard',
        icon: IconLayoutDashboard,
        roles: ['admin', 'branch_manager', 'customer_service'],
      },
      {
        title: 'Parcels',
        url: '/pages/admin/parcels',
        icon: IconPackages,
        roles: ['admin', 'branch_manager', 'customer_service'],
      },
      {
        title: 'Branches',
        url: '/pages/admin/branches',
        icon: Split,
        roles: ['admin'],
      },
      {
        title: 'Dispatchers',
        url: '/pages/admin/dispatchers',
        icon: IconTruckDelivery,
        roles: ['admin'],
      },
      {
        title: 'Customers',
        url: '/pages/admin/customers',
        icon: IconUsersGroup,
        roles: ['admin'],
      },
      {
        title: 'Users',
        url: '/pages/admin/users',
        icon: IconUsers,
        roles: ['admin', 'branch_manager'],
      },
      {
        title: 'Settings',
        icon: Settings2Icon,
        roles: ['admin', 'branch_manager', 'customer_service'],
        items: [
          {
            title: 'Delivery Configurations',
            url: '/pages/admin/settings/delivery-configurations',
            roles: ['admin'],
          },
          {
            title: 'Account',
            url: '/pages/admin/settings',
            roles: ['admin', 'branch_manager', 'customer_service'],
          },
          {
            title: 'Profile',
            url: '/pages/admin/settings/profile',
            roles: ['admin', 'branch_manager', 'customer_service'],
          },
        ],
      },
    ],
  },
]




export function filterNavGroupsByRole(navGroups: NavGroup[], userRole: UserRole): NavGroup[] {
  return navGroups
    .map(group => ({
      ...group,
      items: group.items
        .filter(item => {
          // If no roles specified, show to all
          if (!item.roles) return true;
          // Check if user role is included
          return item.roles.includes(userRole);
        })
        .map(item => {
          // Filter nested items if they exist
          if (item.items) {
            return {
              ...item,
              items: item.items.filter(subItem => {
                if (!subItem.roles) return true;
                return subItem.roles.includes(userRole);
              })
            };
          }
          return item;
        })
        // Remove parent items with no visible children
        .filter(item => !item.items || item.items.length > 0)
    }))
    // Remove empty groups
    .filter(group => group.items.length > 0);
}