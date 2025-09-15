import { createBrowserRouter, RouterProvider } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Toast from '@/@common/components/Toast/Toast';
import ToastProvider from '@/@common/contexts/ToastProvider';
import { useGoogleAnalytics } from '@/libs/googleAnalytics/hooks/useGoogleAnalytics';
import Home from '@/pages/Home/Home';
import RoutieSpace from '@/pages/RoutieSpace/RoutieSpace';
import VersionInfo from '@/pages/VersionInfo/VersionInfo';

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
        <RoutieSpace />
      </LayoutWithAnalytics>
    ),
  },
  {
    path: '/version',
    element: <VersionInfo />,
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
