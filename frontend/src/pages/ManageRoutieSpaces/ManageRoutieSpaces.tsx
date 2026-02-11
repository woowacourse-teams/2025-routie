import { Suspense, useCallback } from 'react';

import ErrorBoundary from '@/@common/components/ErrorBoundary/ErrorBoundary';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import { useCheckLogin } from '@/@common/hooks/useCheckLogin';
import {
  useDeleteRoutieSpaceMutation,
  useSuspenseGetRoutieSpaceListQuery,
} from '@/domains/routieSpace/queries/useRoutieSpaceQuery';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';
import RoutieSpaceListItem from '@/pages/ManageRoutieSpaces/components/RoutieSpaceListItem/RoutieSpaceListItem';

import {
  ManageRoutieSpacesStyle,
  RoutieSpaceListStyle,
} from './ManageRoutieSpaces.styles';
import CreateRoutieSpaceButton from './components/CreateRoutieSpaceButton/CreateRoutieSpaceButton';
import ManageRoutieSpaceBanner from './components/ManageRoutieSpaceBanner/ManageRoutieSpaceBanner';
import ManageRoutieSpaceBannerSkeleton from './components/ManageRoutieSpaceBanner/ManageRoutieSpaceBannerSkeleton';
import ManageRoutieSpacesLayout from './layouts/ManageRoutieSpacesLayout';

const ManageRoutieSpaces = () => {
  useCheckLogin();
  const { data: routieSpaces } = useSuspenseGetRoutieSpaceListQuery();
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

  return (
    <div css={ManageRoutieSpacesStyle}>
      <Header isLoggedIn={true} onLogoClick={handleMoveToHome} />
      <ErrorBoundary fallback={<ManageRoutieSpaceBannerSkeleton />}>
        <Suspense fallback={<ManageRoutieSpaceBannerSkeleton />}>
          <ManageRoutieSpaceBanner />
        </Suspense>
      </ErrorBoundary>
      <ManageRoutieSpacesLayout>
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
      </ManageRoutieSpacesLayout>
    </div>
  );
};

export default ManageRoutieSpaces;
