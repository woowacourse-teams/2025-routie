import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ErrorBoundary from '@/@common/components/ErrorBoundary/ErrorBoundary';
import Flex from '@/@common/components/Flex/Flex';
import ModalManager from '@/@common/components/ModalManager/ModalManager';
import SuspenseFallback from '@/@common/components/SuspenseFallback/SuspenseFallback';
import Text from '@/@common/components/Text/Text';
import Toast from '@/@common/components/Toast/Toast';
import ModalProvider from '@/@common/contexts/ModalProvider';
import ToastProvider from '@/@common/contexts/ToastProvider';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import { useGoogleAnalytics } from '@/libs/googleAnalytics/hooks/useGoogleAnalytics';
import Home from '@/pages/Home/Home';
import KakaoAuthCallback from '@/pages/KakaoAuthCallback/KakaoAuthCallback';
import ManageRoutieSpaces from '@/pages/ManageRoutieSpaces/ManageRoutieSpaces';
import RoutieSpaceNotFound from '@/pages/RoutieSpaceNotFound/RoutieSpaceNotFound';
import VersionInfo from '@/pages/VersionInfo/VersionInfo';

const RoutieSpace = lazy(() => import('@/pages/RoutieSpace/RoutieSpace'));

const LayoutWithAnalytics = ({ children }: { children: React.ReactNode }) => {
  useGoogleAnalytics();
  return (
    <>
      {children}
      <ModalManager />
    </>
  );
};

const RequireAccessToken = ({ children }: { children: React.ReactNode }) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

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
    path: '/auth/kakao/callback',
    element: (
      <LayoutWithAnalytics>
        <KakaoAuthCallback />
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
  {
    path: '/manage-routie-spaces',
    element: (
      <LayoutWithAnalytics>
        <RequireAccessToken>
          <ErrorBoundary
            fallback={
              <Flex gap={1} direction="column" height="100dvh">
                <Text variant="title">일시적인 오류가 발생했습니다.</Text>
                <Text variant="body">잠시 후 다시 시도해주세요.</Text>
                <a href="/">
                  <Text variant="body">홈으로 돌아가기</Text>
                </a>
              </Flex>
            }
          >
            <Suspense fallback={<SuspenseFallback />}>
              <ManageRoutieSpaces />
            </Suspense>
          </ErrorBoundary>
        </RequireAccessToken>
      </LayoutWithAnalytics>
    ),
  },
  {
    path: '/routie-space-not-found',
    element: (
      <LayoutWithAnalytics>
        <RoutieSpaceNotFound />
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
        </ToastProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
};

export default Route;
