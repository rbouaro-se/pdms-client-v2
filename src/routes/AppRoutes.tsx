import { Route, Routes } from "react-router-dom";

import { EnsureAuth, EnsureGuest } from "./RouteProtections";
import NotFoundError from "@/pages/errors/not-found-error";

import LandingPage from "@/pages/landing";

import Dashboard from '@/pages/dashboard'

import React from "react";
import { FullScreenLoading } from "@/components/custom/FullScreenLoading";
import Tracking from "@/pages/tracking";
import Settings from "@/pages/settings";
import SettingsProfile from "@/pages/settings/profile";
import SettingsAccount from "@/pages/settings/account";
import { IconTool, IconUser } from "@tabler/icons-react";
import ComingSoon from "@/components/coming-soon";
import { Main } from "@/components/layout/main";
import Overview  from "@/pages/Overview";
import Tasks from "@/pages/tasks";
import Users from "@/pages/users";
import Apps from "@/pages/apps";

// import ChangePassword from "@/pages/authentication/ChangePassword";
// import PhoneLogin from "@/pages/authentication/PhoneLogin";
const Login = React.lazy(() => import('@/pages/auth/sign-in').then(module => ({ default: module.default })));
const PhoneLogin = React.lazy(() => import('@/pages/auth/sign-in/phone-login').then(module => ({ default: module.default })));
const AdminLayout = React.lazy(() => import('@/components/layout/authenticated-layout').then(module => ({ default: module.default })));

const AppNavLayout = React.lazy(() => import('@/components/layout/app-nav-layout').then(module => ({ default: module.default })));

const AppRoutes = () => {

  return (

    <Routes>

      <Route index element={<LandingPage />} />

      <Route path="/authentication" element={<EnsureGuest />} >

        <Route element={<React.Suspense fallback={<FullScreenLoading />} /> }/>

          <Route index element={<React.Suspense fallback={
            <FullScreenLoading />} >
            <Login />
          </React.Suspense>} />
  
      
          <Route path="login" element={
            <React.Suspense fallback={
          <FullScreenLoading />} >
          <Login />
        </React.Suspense>} />
          <Route path="phone-login" element={<PhoneLogin />} />
          {/* <Route path="forgot-password" element={<ForgetPassword />} /> */}

          
        {/* </Route> */}

      </Route>

      {/* <Route path="/onboarding"
          // element={<EnsureMustVerify />}
        >
          <Route element={<React.Suspense fallback={<FullScreenLoading />}>
            <LazyAuthLayout />
          </React.Suspense>}>
          <Route index element={<Otp purpose="Email" />} />
          <Route path="email" element={<Otp purpose="Email" />} />
            <Route path="phone" element={<Otp purpose="Phone" />} />

            <Route path="stripe" element={<StripeOnboarding />} />
            <Route path="account-inactive" element={<InactiveAccount />} />
        </Route>
        <Route />
        </Route> */}

      {/* <Route path="/recovery/change-password" element={<EnsureMustVerify />}>
        <Route element={<React.Suspense fallback={<FullScreenLoading />} />} >
          <Route index element={<ChangePassword />} />
          </Route>
      </Route> */}

      {/* <Route path="/recovery/confirm-password-reset"
      element={<EnsurePasswordResetConfirmation />}
      >
          <Route element={<React.Suspense fallback={<FullScreenLoading />} />} >
          <Route index element={<Otp purpose="Reset" />} />
        </Route>
      </Route> */}

      <Route path="/admin"
        element={<EnsureAuth restrictedTo={['system']} />}
      >

        <Route path="dashboard" element={<Dashboard />} />
        {/* <Route path="settings/profile" element={<Profile />} /> */}

      </Route>

      <Route path="/pages/admin" element={<EnsureAuth restrictedTo={['system']} />} >
        <Route element={<AdminLayout />} >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="parcels" element={<Tasks />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<Users />} />
          <Route path="dispatchers" element={<Apps />} />
        </Route>
      </Route>

      <Route path="/pages/customer" element={<EnsureAuth restrictedTo={['customer']} />} >
        <Route element={<AppNavLayout />} >
          <Route index element={<Overview />} />
          <Route path="home" element={<Overview />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="tracking/:trackingId" element={<Tracking />} />
          <Route path="support" element={
            <Main fixed>
              <ComingSoon />
            </Main>
          } />
          <Route path="settings" element={<Settings sidebarNavItems={
            [
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
            ]
          } />} >
            <Route index element={<SettingsAccount />} />
            <Route path="profile" element={<SettingsProfile />} />
            <Route path="account" element={<SettingsAccount />} />
          </Route>
          
        </Route>
      </Route>



      {/* <Route path="/pages/client" element={<EnsureAuth restrictedTo={['Client']} />} >
          <Route element={<SidebarLayout />} >
            <Route path="wallet" element={<Wallet />} />
            <Route path="jobs" element={<ClientJobs />} />
            <Route path="job/new" element={<NewJobRequest />} />
            <Route path="job-details/:jobRequestId" element={<JobDetails />} />
            <Route path="calendar" element={<JobCalendar />} />
            <Route path="home" element={<Home renderFor="Client" />} />
            <Route path="messages" element={<Chat />} />
            <Route path="wallet/top-up" element={<Deposit />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="/pages/packer" element={<EnsureAuth restrictedTo={['Business', 'Individual']} />} >
          <Route element={<SidebarLayout />} >
            <Route path="home" element={<Home renderFor="Packer" />} />
            <Route path="jobs" element={<PackerJobs />} />
            <Route path="job-details/:jobRequestId" element={<JobDetails />} />
            <Route path="job-requests" element={<Home renderFor="Packer" />} />
            <Route path="messages" element={<Chat />} />
            <Route path="calendar" element={<JobCalendar />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>


        <Route path="/settings" element={<EnsureAuth restrictedTo={['Business', 'Individual', 'Admin', 'Client']} />} >
          <Route element={<SidebarLayout />} >
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route> */}


      <Route path="*" element={<NotFoundError />} />
    </Routes>
  );
};

export default AppRoutes;
