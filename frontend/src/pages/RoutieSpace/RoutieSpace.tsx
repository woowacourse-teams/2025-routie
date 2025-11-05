import { useEffect, useLayoutEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import FeedbackWidget from '@/@common/components/FeedbackWidget/FeedbackWidget';
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
import { useRoutieSpaceStream } from '@/domains/routieSpace/hooks/useRoutieSpaceStream';
import { useRoutieSpaceQuery } from '@/domains/routieSpace/queries/useRoutieSpaceQuery';
import Sidebar from '@/pages/RoutieSpace/components/Sidebar/Sidebar';

import { RoutieSpaceContainerStyle } from './RoutieSpace.styles';

const RoutieSpace = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { showToast } = useToastContext();
  const { error } = useUserQuery();
  const { error: routieSpaceError } = useRoutieSpaceQuery();
  const routieSpaceIdentifier = searchParams.get('routieSpaceIdentifier');
  const accessToken = getAccessToken();
  const { isOpen: isSidebarOpen, handleToggle: handleSidebarToggle } =
    useToggle();

  usePlaceStream();
  useRoutieStream();
  useRoutieSpaceStream();

  useLayoutEffect(() => {
    if (routieSpaceIdentifier) {
      sessionStorageUtils.set('routieSpaceUuid', routieSpaceIdentifier);
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

  useEffect(() => {
    if (routieSpaceError) {
      const errorMessage = routieSpaceError.message;
      const isNotFoundError =
        errorMessage.includes('방 찾기에 실패했습니다') ||
        errorMessage.includes('방을 찾을 수 없습니다') ||
        errorMessage.includes('존재하지 않는 방입니다');

      if (isNotFoundError) {
        navigate('/routie-space-not-found');
      }
    }
  }, [routieSpaceError, navigate]);

  console.log('for CD');

  return (
    <HashtagFilterProvider>
      <div css={RoutieSpaceContainerStyle}>
        <KakaoMap isSidebarOpen={isSidebarOpen} />
        {accessToken && <UserMenuButton />}
        <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
      </div>
      <FeedbackWidget />
    </HashtagFilterProvider>
  );
};

export default RoutieSpace;
