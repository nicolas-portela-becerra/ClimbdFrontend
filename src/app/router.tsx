import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RouteError } from './ErrorBoundary'
import { RequireAuth } from './guards/RequireAuth'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { Spinner } from '@/shared/ui/Spinner'

// Every page is code-split: its module is downloaded the first time the route is visited.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
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
              { path: '/me', lazy: page(() => import('@/routes/profile')) },
            ],
          },
          { path: '/boulders/:boulderId', lazy: page(() => import('@/routes/boulder-detail')) },
          {
            path: '/gyms/:gymId/walls/:wallId/new',
            lazy: page(() => import('@/routes/boulder-create')),
          },
        ],
      },
      { path: '*', lazy: page(() => import('@/routes/not-found')) },
    ],
  },
])
