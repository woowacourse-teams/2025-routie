import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ModalManager from '@/@common/components/ModalManager/ModalManager';
import Toast from '@/@common/components/Toast/Toast';
import ModalProvider from '@/@common/contexts/ModalProvider';
import ToastProvider from '@/@common/contexts/ToastProvider';
import { useGoogleAnalytics } from '@/libs/googleAnalytics/hooks/useGoogleAnalytics';
import Home from '@/pages/Home/Home';
import VersionInfo from '@/pages/VersionInfo/VersionInfo';

const RoutieSpace = lazy(() => import('@/pages/RoutieSpace/RoutieSpace'));

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
        <Home />
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
      <LayoutWithAnalytics>
        <VersionInfo />
      </LayoutWithAnalytics>
    ),
  },
]);

const Route = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <ToastProvider>
          <RouterProvider router={router} />
          <Toast />
          <ModalManager />
        </ToastProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
};

export default Route;
