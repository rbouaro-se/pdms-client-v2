import { clearUser } from '@/redux/slices/auth';
import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// Navigation helper (full page navigation is intentional for auth/maintenance flows)
const navigateTo = (path: string) => {
  window.location.href = path
}

const isProtectedRoute = () => {
  const protectedPaths = ['/pages/', '/dashboard/', '/settings/']
  return protectedPaths.some((path) =>
    window.location.pathname.startsWith(path)
  )
}

const isAuthRoute = () => {
  return window.location.pathname.startsWith('/authentication/')
}

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: 'include',
})

/**
 * Simplified baseQuery wrapper that only handles:
 * - 401 Unauthorized: clear user & redirect to login if on protected route
 * - 403 Forbidden: redirect to 403 page if on protected route
 * - Network / API down (fetch error): redirect to maintenance
 *
 * All other errors are returned to the caller so components can handle them locally.
 */
const baseQueryWithMinimalHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  try {
    const result = await baseQuery(args, api, extraOptions)
    if (result?.error) {
      const err: any = result.error
      const status = err.status

      // Unauthorized: clear session and redirect to login for protected routes
      if (status === 401) {
        try {
          api.dispatch(clearUser())
        } catch {
          // ignore dispatch errors in edge cases
        }

        if (isProtectedRoute() && !isAuthRoute()) {
          const returnUrl = encodeURIComponent(
            window.location.pathname + window.location.search
          )
          navigateTo(`/authentication/login?returnUrl=${returnUrl}`)
        }

        // Return the result so consuming code still sees the 401 if it wants to
        return result
      }

      // Forbidden: redirect to 403 for protected routes, otherwise let caller handle it
      if (status === 403) {
        if (isProtectedRoute()) {
          navigateTo('/error/403')
        }
        return result
      }

      // fetchBaseQuery reports network issues as status === 'FETCH_ERROR'
      if (
        status === 'FETCH_ERROR' ||
        (err.error && String(err.error).includes('Failed to fetch'))
      ) {
        // API unreachable / network down -> maintenance page
        if (isProtectedRoute()) {
          navigateTo('/maintenance')
        }
        return result
      }

      // For all other status codes we intentionally do NOT navigate:
      // let the component handle the error (validation messages, toasts, etc.)
    }

    return result
  } catch (error: any) {
    // Fallback for unexpected network errors thrown as exceptions (e.g. TypeError)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      navigateTo('/maintenance')
      // Swallowing here would hide the error from callers; rethrow so components/tests can still observe it.
      throw error
    }

    // Re-throw anything else for callers to handle
    throw error
  }
}

export const API = createApi({
  baseQuery: baseQueryWithMinimalHandling,
  tagTypes: ['Parcel', 'Customer', 'Dispatcher', 'Branch', 'User', 'Dashboard'],
  endpoints: () => ({}),
})