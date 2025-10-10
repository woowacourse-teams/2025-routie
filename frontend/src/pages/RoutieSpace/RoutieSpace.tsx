import { useEffect, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router';

import { useModal } from '@/@common/contexts/ModalContext';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import UserMenuButton from '@/domains/auth/components/UserMenuButton/UserMenuButton';
import { useUserQuery } from '@/domains/auth/queries/useAuthQuery';
import KakaoMap from '@/domains/maps/components/KakaoMap/KakaoMap';
import Sidebar from '@/layouts/Sidebar/Sidebar';

import { RoutieSpaceContainerStyle } from './RoutieSpace.styles';

const RoutieSpace = () => {
  const [searchParams] = useSearchParams();
  const { openModal } = useModal();
  const { showToast } = useToastContext();
  const { error } = useUserQuery();
  const routieSpaceIdentifier = searchParams.get('routieSpaceIdentifier');
  const accessToken = getAccessToken();

  useLayoutEffect(() => {
    if (routieSpaceIdentifier) {
      localStorage.setItem('routieSpaceUuid', routieSpaceIdentifier);
    }
  }, [routieSpaceIdentifier]);

  useEffect(() => {
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
    <div css={RoutieSpaceContainerStyle}>
      <KakaoMap />
      {accessToken && <UserMenuButton />}
      <Sidebar />
    </div>
  );
};

export default RoutieSpace;
