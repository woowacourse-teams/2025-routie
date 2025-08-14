import { createBrowserRouter, RouterProvider } from 'react-router';

import Toast from '@/@common/components/Toast/Toast';
import { ToastProvider } from '@/@common/contexts/useToastContext';
import { useGoogleAnalytics } from '@/libs/googleAnalytics/hooks/useGoogleAnalytics';
import Home from '@/pages/Home/Home';
import RoutieSpace from '@/pages/RoutieSpace/RoutieSpace';

const LayoutWithAnalytics = ({ children }: { children: React.ReactNode }) => {
  useGoogleAnalytics();
  return <>{children}</>;
};

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
]);

const Route = () => {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
      <Toast />
    </ToastProvider>
  );
};

export default Route;
