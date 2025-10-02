import { useCallback } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import { useCheckLogin } from '@/@common/hooks/useCheckLogin';
import UserMenuButton from '@/domains/auth/components/UserMenuButton/UserMenuButton';
import {
  useDeleteRoutieSpaceMutation,
  useGetRoutieSpaceListQuery,
} from '@/domains/routieSpace/queries/useRoutieSpaceQuery';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';
import RoutieSpaceListItem from '@/pages/ManageRoutieSpaces/components/RoutieSpaceListItem/RoutieSpaceListItem';

import {
  ManageRoutieSpacesStyle,
  RoutieSpaceListStyle,
} from './ManageRoutieSpaces.styles';
import ManageRoutieSpacesLayout from './layouts/ManageRoutieSpacesLayout';

const ManageRoutieSpaces = () => {
  useCheckLogin();
  const {
    data: routieSpaces = [],
    isLoading,
    error,
  } = useGetRoutieSpaceListQuery();
  const { handleCreateRoutieSpace, handleMoveToRoutieSpace, handleMoveToHome } =
    useRoutieSpaceNavigation();
  const { mutate: deleteRoutieSpace } = useDeleteRoutieSpaceMutation();

  const handleClickRoutieSpace = useCallback(
    (routieSpaceUuid: string) => {
      handleMoveToRoutieSpace(routieSpaceUuid);
    },
    [handleMoveToRoutieSpace],
  );

  const handleDeleteRoutieSpace = useCallback(
    (routieSpaceUuid: string) => {
      deleteRoutieSpace(routieSpaceUuid);
    },
    [deleteRoutieSpace],
  );

  if (error) {
    return (
      <Flex gap={1} direction="column" height="100dvh">
        <Text variant="title">일시적인 오류가 발생했습니다.</Text>
        <Text variant="body">잠시 후 다시 시도해주세요.</Text>
        <Text variant="caption">{error.message}</Text>
        <Button width="14rem" onClick={handleMoveToHome}>
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
              <Button width="14rem" onClick={handleCreateRoutieSpace}>
                <Text variant="body">동선 만들기</Text>
              </Button>
            </Flex>
            {routieSpaces.length > 0 ? (
              <ul css={RoutieSpaceListStyle}>
                {routieSpaces.map((routieSpace) => (
                  <RoutieSpaceListItem
                    key={routieSpace.routieSpaceUuid}
                    {...routieSpace}
                    onClickRoutieSpace={handleClickRoutieSpace}
                    onDeleteRoutieSpace={handleDeleteRoutieSpace}
                  />
                ))}
              </ul>
            ) : (
              <Flex height="50dvh">
                <Text variant="body">아직 생성한 동선이 없습니다...😅</Text>
              </Flex>
            )}
          </>
        )}
      </ManageRoutieSpacesLayout>
    </div>
  );
};

export default ManageRoutieSpaces;
