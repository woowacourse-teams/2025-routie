import { useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router';

import UserMenuButton from '@/domains/auth/components/UserMenuButton/UserMenuButton';
import KakaoMap from '@/domains/maps/components/KakaoMap/KakaoMap';
import Sidebar from '@/layouts/Sidebar/Sidebar';

import { RoutieSpaceContainerStyle } from './RoutieSpace.styles';

const RoutieSpace = () => {
  const [searchParams] = useSearchParams();
  const routieSpaceIdentifier = searchParams.get('routieSpaceIdentifier');
  const accessToken = localStorage.getItem('accessToken');

  useLayoutEffect(() => {
    if (routieSpaceIdentifier) {
      localStorage.setItem('routieSpaceUuid', routieSpaceIdentifier);
    }
  }, [routieSpaceIdentifier]);

  return (
    <div css={RoutieSpaceContainerStyle}>
      <KakaoMap />
      {accessToken && <UserMenuButton />}
      <Sidebar />
    </div>
  );
};

export default RoutieSpace;
