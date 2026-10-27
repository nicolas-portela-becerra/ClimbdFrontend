import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from 'react-router-dom'
import { RouteError } from './ErrorBoundary'
import { UserDtoRoleEnum } from '@api'
import { RequireAuth } from './guards/RequireAuth'
import { RequireRole } from './guards/RequireRole'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { Spinner } from '@/shared/ui/Spinner'

// Every page is code-split: its module is downloaded the first time the route is visited.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    // Back/forward navigation returns to the scroll position the page had.
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    errorElement: <RouteError />,
    hydrateFallbackElement: (
      <div className="grid min-h-dvh place-items-center">
        <Spinner />
      </div>
    ),
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', lazy: page(() => import('@/routes/login')) },
          { path: '/register', lazy: page(() => import('@/routes/register')) },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          { path: '/', element: <Navigate to="/gyms" replace /> },
          {
            element: <AppLayout />,
            children: [
              { path: '/gyms', lazy: page(() => import('@/routes/gyms')) },
              { path: '/gyms/:gymId', lazy: page(() => import('@/routes/gym-walls')) },
              {
                path: '/gyms/:gymId/walls/:wallId',
                lazy: page(() => import('@/routes/wall-boulders')),
              },
              { path: '/me', lazy: page(() => import('@/routes/profile')) },
              {
                element: <RequireRole role={UserDtoRoleEnum.Admin} />,
                children: [
                  { path: '/users/activate', lazy: page(() => import('@/routes/users-activate')) },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', lazy: page(() => import('@/routes/not-found')) },
    ],
  },
])
