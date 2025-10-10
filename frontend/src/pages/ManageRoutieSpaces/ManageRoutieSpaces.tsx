import { useCallback } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import { useCheckLogin } from '@/@common/hooks/useCheckLogin';
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
import CreateRoutieSpaceButton from './components/CreateRoutieSpaceButton/CreateRoutieSpaceButton';
import ManageRoutieSpaceBanner from './components/ManageRoutieSpaceBanner/ManageRoutieSpaceBanner';
import ManageRoutieSpacesLayout from './layouts/ManageRoutieSpacesLayout';

const ManageRoutieSpaces = () => {
  useCheckLogin();
  const {
    data: routieSpaces = [],
    isLoading,
    error,
  } = useGetRoutieSpaceListQuery();
  const { handleMoveToRoutieSpace, handleMoveToHome, handleCreateRoutieSpace } =
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
      <Header isLoggedIn={true} onLogoClick={handleMoveToHome} />
      <ManageRoutieSpaceBanner />
      <ManageRoutieSpacesLayout>
        {isLoading ? (
          <Flex height="calc(100dvh - 7.1rem)">
            <Text variant="title">로딩중...</Text>
          </Flex>
        ) : (
          <>
            <Flex justifyContent="space-between" margin="1.2rem 0 0 0">
              <Text variant="subTitle">동선 목록</Text>
              <Text variant="subTitle">총 {routieSpaces.length}개</Text>
            </Flex>
            <ul css={RoutieSpaceListStyle}>
              <li>
                <CreateRoutieSpaceButton onClick={handleCreateRoutieSpace} />
              </li>
              {routieSpaces.map((routieSpace) => (
                <RoutieSpaceListItem
                  key={routieSpace.routieSpaceUuid}
                  {...routieSpace}
                  onClickRoutieSpace={handleClickRoutieSpace}
                  onDeleteRoutieSpace={handleDeleteRoutieSpace}
                />
              ))}
            </ul>
          </>
        )}
      </ManageRoutieSpacesLayout>
    </div>
  );
};

export default ManageRoutieSpaces;
