import { useEffect, useMemo, useState } from "react";
import { Outlet,  useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/store";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { TopNav } from '@/components/layout/top-nav';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { ThemeSwitch } from '@/components/theme-switch';
import { SidebarProvider } from "../ui/sidebar";

interface NavItem {
    title: string;
    href: string;
    disabled?: boolean;
    exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        title: 'Overview',
        href: '/pages/customer',
        exact: true,
    },
    {
        title: 'Tracking',
        href: '/pages/customer/tracking',
    },
    {
        title: 'Support',
        href: '/pages/customer/support',
    },
    {
        title: 'Settings',
        href: '/pages/customer/settings',
    },
];

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
    fixed?: boolean;
}

const Header = ({
    className,
    fixed,
    children,
    ...props
}: HeaderProps) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            setOffset(document.body.scrollTop || document.documentElement.scrollTop);
        };

        document.addEventListener('scroll', onScroll, { passive: true });
        return () => document.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky border-b-[1px] top-0 z-40 bg-background flex h-16 items-center gap-3 p-4 px-8 sm:gap-4',
                fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
                offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
                className
            )}
            {...props}
        >
            <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>PDMS</span>
                <span className='truncate text-xs'>Delivery Express</span>
            </div>
            <Separator orientation='vertical' className='h-6' />
            {children}
        </header>
    );
};

const AppNavLayout = () => {
    const location = useLocation();
    const { user } = useAppSelector(state => state.auth);
    // const navigate = useNavigate();

    const enhancedNavItems = useMemo(() => {
        return NAV_ITEMS.map((item) => {
            let isActive = false;

            if (item.exact) {
                isActive = location.pathname === item.href;
            } else {
                isActive = location.pathname.startsWith(item.href);
            }

            return {
                ...item,
                isActive,
            };
        });
    }, [location.pathname]);

    return (
        <>
            <Header>
                <TopNav links={enhancedNavItems} />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown user={user}
                        logoutRedirectUrl='/authentication/phone-login'
                        profilePageUrl='/pages/customer/settings/profile'
                        settingPageUrl='/pages/customer/settings'
                    />
                </div>
            </Header>
            <SidebarProvider>
                <Outlet />
            </SidebarProvider>
            
        </>
    );
};

export default AppNavLayout;