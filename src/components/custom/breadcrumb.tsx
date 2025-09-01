import { SlashIcon } from "lucide-react"
import { Link, useLocation } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Header } from '@/components/layout/header'

// Create a mapping of paths to breadcrumb labels
const breadcrumbNameMap: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/dashboard/overview': 'Overview',
    '/parcels': 'Parcels',
    '/customers': 'Customers',
    '/branches': 'Branches',
    '/dispatchers': 'Dispatchers',
    '/reports': 'Reports',
    '/settings': 'Settings',
    '/settings/profile': 'Profile',
    '/settings/account': 'Account',
    '/authentication/login': 'Login',
}

export function BreadcrumbNavigation() {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`
                    const isLast = index === pathnames.length - 1
                    const title = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1)

                    return (
                        <span key={to} className="flex items-center">
                            <BreadcrumbSeparator>
                                <SlashIcon className="h-3 w-3" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={to}>{title}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </span>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}