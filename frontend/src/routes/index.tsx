import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Toast from '@/@common/components/Toast/Toast';
import ToastProvider from '@/@common/contexts/ToastProvider';
import { useGoogleAnalytics } from '@/libs/googleAnalytics/hooks/useGoogleAnalytics';

const Home = lazy(() => import('@/pages/Home/Home'));
const RoutieSpace = lazy(() => import('@/pages/RoutieSpace/RoutieSpace'));
const VersionInfo = lazy(() => import('@/pages/VersionInfo/VersionInfo'));

const LayoutWithAnalytics = ({ children }: { children: React.ReactNode }) => {
  useGoogleAnalytics();
  return <>{children}</>;
};

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LayoutWithAnalytics>
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      </LayoutWithAnalytics>
    ),
  },
  {
    path: '/routie-spaces',
    element: (
      <LayoutWithAnalytics>
        <Suspense fallback={<div>Loading...</div>}>
          <RoutieSpace />
        </Suspense>
      </LayoutWithAnalytics>
    ),
  },
  {
    path: '/version',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VersionInfo />
      </Suspense>
    ),
  },
]);

const Route = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
        <Toast />
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default Route;
