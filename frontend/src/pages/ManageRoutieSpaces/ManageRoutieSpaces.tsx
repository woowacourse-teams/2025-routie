import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import UserMenuButton from '@/domains/auth/components/UserMenuButton/UserMenuButton';
import { useGetRoutieSpaceListQuery } from '@/domains/routieSpace/queries/useRoutieSpaceQuery';
import RoutieSpaceList from '@/pages/ManageRoutieSpaces/components/RoutieSpaceList/RoutieSpaceList';
import theme from '@/styles/theme';

import { ManageRoutieSpacesStyle } from './ManageRoutieSpaces.styles';
import ManageRoutieSpacesLayout from './layouts/ManageRoutieSpacesLayout';

const ManageRoutieSpaces = () => {
  const kakaoAccessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const { data: routieSpaces, isLoading, error } = useGetRoutieSpaceListQuery();
  const { showToast } = useToastContext();

  useEffect(() => {
    if (!kakaoAccessToken) {
      alert('로그인이 필요합니다.');
      navigate('/', { replace: true });

      return;
    }
  }, [kakaoAccessToken, navigate]);

  useEffect(() => {
    if (error) {
      showToast({
        message: error.message,
        type: 'error',
      });
    }
  }, [error, showToast]);

  if (!kakaoAccessToken) {
    return null;
  }

  if (error) {
    return (
      <Flex gap={1} direction="column" height="100dvh">
        <Text variant="title">일시적인 오류가 발생했습니다.</Text>
        <Text variant="body">잠시 후 다시 시도해주세요.</Text>
        <Button width="14rem" onClick={() => navigate('/')}>
          <Text variant="body">홈으로 돌아가기</Text>
        </Button>
      </Flex>
    );
  }

  return (
    <div css={ManageRoutieSpacesStyle}>
      <Header>
        <UserMenuButton />
      </Header>
      <ManageRoutieSpacesLayout>
        {isLoading ? (
          <Flex height="calc(100dvh - 7.1rem)">
            <Text variant="title">로딩중...</Text>
          </Flex>
        ) : (
          <>
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
            <RoutieSpaceList routieSpaces={routieSpaces || []} />
          </>
        )}
      </ManageRoutieSpacesLayout>
    </div>
  );
};

export default ManageRoutieSpaces;
