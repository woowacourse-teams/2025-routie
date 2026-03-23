import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useSearchParams,
} from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ErrorBoundary from '@/@common/components/ErrorBoundary/ErrorBoundary';
import type { FallbackRenderProps } from '@/@common/components/ErrorBoundary/ErrorBoundary.types';
import Flex from '@/@common/components/Flex/Flex';
import ModalManager from '@/@common/components/ModalManager/ModalManager';
import Text from '@/@common/components/Text/Text';
import Toast from '@/@common/components/Toast/Toast';
import ModalProvider from '@/@common/contexts/ModalProvider';
import ToastProvider from '@/@common/contexts/ToastProvider';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import { RoutieSpaceNotFoundError } from '@/apis';
import { useGoogleAnalytics } from '@/libs/googleAnalytics/hooks/useGoogleAnalytics';
import Home from '@/pages/Home/Home';
import KakaoAuthCallback from '@/pages/KakaoAuthCallback/KakaoAuthCallback';
import ManageRoutieSpaces from '@/pages/ManageRoutieSpaces/ManageRoutieSpaces';
import ManageRoutieSpacesSkeleton from '@/pages/ManageRoutieSpaces/ManageRoutieSpacesSkeleton';
import RoutieSpaceSkeleton from '@/pages/RoutieSpace/RoutieSpaceSkeleton';
import RoutieSpaceNotFound from '@/pages/RoutieSpaceNotFound/RoutieSpaceNotFound';
import VersionInfo from '@/pages/VersionInfo/VersionInfo';


const RoutieSpace = lazy(() => import('@/pages/RoutieSpace/RoutieSpace'));

const RouteErrorFallback = ({ error, resetErrorBoundary }: FallbackRenderProps) => {
  if (error instanceof RoutieSpaceNotFoundError) {
    return <Navigate to="/routie-space-not-found" replace />;
  }

  return (
    <Flex gap={1} direction="column" height="100dvh">
      <Text variant="title">일시적인 오류가 발생했습니다.</Text>
      <Text variant="body">잠시 후 다시 시도해주세요.</Text>
      <button type="button" onClick={resetErrorBoundary}>
        <Text variant="body">다시 시도</Text>
      </button>
      <a href="/">
        <Text variant="body">홈으로 돌아가기</Text>
      </a>
    </Flex>
  );
};

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

const RoutieSpaceRoute = () => {
  const [searchParams] = useSearchParams();

  return (
    <ErrorBoundary
      resetKeys={[searchParams.get('routieSpaceIdentifier')]}
      fallbackRender={RouteErrorFallback}
    >
      <Suspense fallback={<RoutieSpaceSkeleton />}>
        <RoutieSpace />
      </Suspense>
    </ErrorBoundary>
  );
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
        <RoutieSpaceRoute />
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
          <ErrorBoundary fallbackRender={RouteErrorFallback}>
            <Suspense fallback={<ManageRoutieSpacesSkeleton />}>
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
