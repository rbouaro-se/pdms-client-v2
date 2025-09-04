import { Route, Routes } from "react-router-dom";

import { EnsureAuth, EnsureGuest, EnsureRole } from "./RouteProtections";
import NotFoundError from "@/pages/errors/not-found-error";

import LandingPage from "@/pages/landing";

import Dashboard from '@/pages/dashboard'

import React from "react";
import Tracking from "@/pages/tracking";
import Settings from "@/pages/settings";
import SettingsProfile from "@/pages/settings/profile";
import SettingsAccount from "@/pages/settings/account";
import { IconSettings, IconTool, IconUser } from "@tabler/icons-react";
import ComingSoon from "@/components/coming-soon";
import Overview  from "@/pages/Overview";
import Parcels from "@/pages/parcels";
import Users from "@/pages/users";
import Customers from "@/pages/customers";
import Dispatchers from "@/pages/dispatchers";
import Customer from "@/pages/customer";
import Branches from "@/pages/branches";
import DeliveryConfigurations from "@/pages/settings/configurations";
import UnauthorisedError from "@/pages/errors/unauthorized-error";
import ForgotPassword from "@/pages/auth/forgot-password";


// import ChangePassword from "@/pages/authentication/ChangePassword";
// import PhoneLogin from "@/pages/authentication/PhoneLogin";
const Login = React.lazy(() => import('@/pages/auth/sign-in').then(module => ({ default: module.default })));
const PhoneLogin = React.lazy(() => import('@/pages/auth/sign-in/phone-login').then(module => ({ default: module.default })));
const AdminLayout = React.lazy(() => import('@/components/layout/authenticated-layout').then(module => ({ default: module.default })));

const AppNavLayout = React.lazy(() => import('@/components/layout/app-nav-layout').then(module => ({ default: module.default })));

const AccountActivation = React.lazy(() => import('@/pages/auth/sign-in/components/activate-account').then(module => ({ default: module.default })));

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<LandingPage />} />

      <Route path="/authentication" element={<EnsureGuest />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="phone-login" element={<PhoneLogin />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        
      </Route>

      

      {/* Admin Routes with Role-Based Protection */}
      <Route path="/pages/admin" element={
        <EnsureAuth requiredRoles={['admin', 'branch_manager', 'customer_service']} />
      }>
        <Route path="activate" element={<AccountActivation />} />

        <Route element={<AdminLayout />}>
          
          <Route index element={<Dashboard />} />

          <Route path="dashboard" element={<Dashboard />} />

          {/* Admin-only routes */}
          <Route path="parcels" element={
            <EnsureRole roles={['admin', 'branch_manager','customer_service']} />
          }>
            <Route index element={<Parcels />} />
          </Route>

          <Route path="users" element={
            <EnsureRole roles={['admin', 'branch_manager']} />
          }>
            <Route index element={<Users />} />
          </Route>

          <Route path="customers" element={
            <EnsureRole roles={['admin', 'branch_manager']} />
          }>
            <Route index element={<Customers />} />
          </Route>

          <Route path="customers/:customerId" element={
            <EnsureRole roles={['admin', 'branch_manager']} />
          }>
            <Route index element={<Customer />} />
          </Route>

          <Route path="dispatchers" element={
            <EnsureRole roles={['admin']} />
          }>
            <Route index element={<Dispatchers />} />
          </Route>

          <Route path="branches" element={
            <EnsureRole roles={['admin']} />
          }>
            <Route index element={<Branches />} />
          </Route>

          <Route path="settings" element={<Settings sidebarNavItems={[
            {
              title: 'Profile',
              icon: <IconUser size={18} />,
              href: '/pages/admin/settings/profile'
            },
            {
              title: 'Account',
              icon: <IconTool size={18} />,
              href: '/pages/admin/settings/account'
            },
            {
              title: 'Delivery Configurations',
              icon: <IconSettings size={18} />,
              href: '/pages/admin/settings/delivery-configurations',
            }
          ]} />}>
            <Route index element={<SettingsAccount />} />
            <Route path="profile" element={<SettingsProfile />} />
            <Route path="account" element={<SettingsAccount />} />
            <Route path="delivery-configurations" element={
              <EnsureRole roles={['admin']} />
            }>
              <Route index element={<DeliveryConfigurations />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Customer Routes */}
      <Route path="/pages/customer" element={<EnsureAuth requiredRoles={['customer']} />}>
        <Route element={<AppNavLayout />}>
          <Route index element={<Overview />} />
          <Route path="home" element={<Overview />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="tracking/:trackingId" element={<Tracking />} />
          <Route path="support" element={<ComingSoon />} />
          <Route path="settings" element={<Settings sidebarNavItems={[
            {
              title: 'Profile',
              icon: <IconUser size={18} />,
              href: '/pages/customer/settings/profile',
            },
            {
              title: 'Account',
              icon: <IconTool size={18} />,
              href: '/pages/customer/settings/account',
            }
          ]} />}>
            <Route index element={<SettingsProfile />} />
            <Route path="profile" element={<SettingsProfile />} />
            <Route path="account" element={<SettingsAccount />} />
          </Route>
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/pages/unauthorized" element={<UnauthorisedError />} />
      <Route path="*" element={<NotFoundError />} />
    </Routes>
  );
};

export default AppRoutes;
