import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import { useModal } from '@/@common/contexts/ModalContext';
import UserMenuButton from '@/domains/auth/components/UserMenuButton/UserMenuButton';
import RoutieSpaceList from '@/pages/ManageRoutieSpaces/components/RoutieSpaceList/RoutieSpaceList';
import theme from '@/styles/theme';

import { ManageRoutieSpacesStyle } from './MavageRoutieSpaces.styles';
import ManageRoutieSpacesLayout from './layouts/ManageRoutieSpacesLayout';

const routieSpaces = [
  {
    routieSpaceUuid: '1',
    name: 'Routie Space 1',
    date: new Date(),
  },
  {
    routieSpaceUuid: '2',
    name: 'Routie Space 2',
    date: new Date(),
  },

  {
    routieSpaceUuid: '3',
    name: 'Routie Space 3',
    date: new Date(),
  },
  {
    routieSpaceUuid: '4',
    name: 'Routie Space 4',
    date: new Date(),
  },
];

const ManageRoutieSpaces = () => {
  const kakaoAccessToken = localStorage.getItem('accessToken');
  const { openModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!kakaoAccessToken) {
      alert('로그인이 필요합니다.');
      navigate('/', { replace: true });

      return;
    }
  }, [kakaoAccessToken, navigate]);

  if (!kakaoAccessToken) {
    return null;
  }

  const handleLoginClick = () => {
    openModal('login');
  };

  return (
    <div css={ManageRoutieSpacesStyle}>
      <Header>
        {kakaoAccessToken ? (
          <UserMenuButton />
        ) : (
          <Button width="fit-content" onClick={handleLoginClick}>
            <Text variant="body">로그인</Text>
          </Button>
        )}
      </Header>
      <ManageRoutieSpacesLayout>
        <Flex gap={3} justifyContent="space-between">
          <Text variant="title">관리할 루티 공간 목록</Text>
          <Button
            width="14rem"
            css={css`
              &:hover {
                background-color: ${theme.colors.purple[50]};
              }
            `}
          >
            <Text variant="body">동선 만들기</Text>
          </Button>
        </Flex>
        <RoutieSpaceList routieSpaces={routieSpaces} />
      </ManageRoutieSpacesLayout>
    </div>
  );
};

export default ManageRoutieSpaces;
