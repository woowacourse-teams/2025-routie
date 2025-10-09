import { useEffect, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router';

import Flex from '@/@common/components/Flex/Flex';
import { useModal } from '@/@common/contexts/ModalContext';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import { useUserQuery } from '@/domains/auth/queries/useAuthQuery';
import MapWithSideSheet from '@/layouts/MapWithSideSheet/MapWithSideSheet';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const [searchParams] = useSearchParams();
  const { openModal } = useModal();
  const { showToast } = useToastContext();
  const routieSpaceIdentifier = searchParams.get('routieSpaceIdentifier');
  const { error } = useUserQuery();

  useLayoutEffect(() => {
    if (routieSpaceIdentifier) {
      localStorage.setItem('routieSpaceUuid', routieSpaceIdentifier);
    }
  }, [routieSpaceIdentifier]);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      openModal('login');
    }
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        message: '사용자 정보를 불러오는 중 에러가 발생했습니다.',
        type: 'error',
      });
      console.error(error);
    }
  }, [error, showToast]);

  return (
    <Flex justifyContent="flex-start" height="100vh">
      <Flex direction="column" justifyContent="flex-start" height="100%">
        <Sidebar />
      </Flex>
      <Flex direction="column" justifyContent="flex-start" height="100%">
        <MapWithSideSheet />
      </Flex>
    </Flex>
  );
};

export default RoutieSpace;
