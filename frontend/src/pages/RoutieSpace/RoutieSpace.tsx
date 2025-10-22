import { useEffect, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router';

import { useModal } from '@/@common/contexts/ModalContext';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useToggle } from '@/@common/hooks/useToggle';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import { sessionStorageUtils } from '@/@common/utils/sessionStorage';
import UserMenuButton from '@/domains/auth/components/UserMenuButton/UserMenuButton';
import { useUserQuery } from '@/domains/auth/queries/useAuthQuery';
import KakaoMap from '@/domains/maps/components/KakaoMap/KakaoMap';
import HashtagFilterProvider from '@/domains/places/contexts/HashtagFilterProvider';
import { usePlaceStream } from '@/domains/places/hooks/usePlaceStream';
import { useRoutieStream } from '@/domains/routie/hooks/useRoutieStream';
import Sidebar from '@/pages/RoutieSpace/components/Sidebar/Sidebar';

import { RoutieSpaceContainerStyle } from './RoutieSpace.styles';

const RoutieSpace = () => {
  const [searchParams] = useSearchParams();
  const { openModal } = useModal();
  const { showToast } = useToastContext();
  const { error } = useUserQuery();
  const routieSpaceIdentifier = searchParams.get('routieSpaceIdentifier');
  const accessToken = getAccessToken();
  const { isOpen: isSidebarOpen, handleToggle: handleSidebarToggle } =
    useToggle();

  usePlaceStream();
  useRoutieStream();

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

  useEffect(() => {
    return () => {
      sessionStorageUtils.remove('selectedHashtags');
    };
  }, []);

  return (
    <HashtagFilterProvider>
      <div css={RoutieSpaceContainerStyle}>
        <KakaoMap isSidebarOpen={isSidebarOpen} />
        {accessToken && <UserMenuButton />}
        <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
      </div>
    </HashtagFilterProvider>
  );
};

export default RoutieSpace;
