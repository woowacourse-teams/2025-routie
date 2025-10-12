import { useCallback } from 'react';

import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import { useModal } from '@/@common/contexts/ModalContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import PlaceCard from '@/domains/places/components/PlaceCard/PlaceCard';
import SearchBox from '@/domains/places/components/SearchBox/SearchBox';
import { usePlaceLikes } from '@/domains/places/hooks/usePlaceLikes';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';
import {
  PlaceListContainerStyle,
  PlaceViewContainerStyle,
} from '@/pages/RoutieSpace/components/PlaceView/PlaceView.styles';

const PlaceView = () => {
  const { placeList, handleDeletePlace } = usePlaceList();
  const { handleLikePlace, handleDeleteLikePlace, likedPlaceIds } =
    usePlaceLikes();
  const { routieIdList, handleAddRoutie } = useRoutieList();
  const { openModal } = useModal();
  const { triggerEvent } = useGoogleEventTrigger();

  const ensureAuthenticated = useCallback(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      openModal('login');
      return false;
    }

    return true;
  }, [openModal]);

  const handleOpenAddModalClick = useCallback(() => {
    if (!ensureAuthenticated()) return;

    triggerEvent({
      action: 'click',
      category: 'place',
      label: '장소 추가하기 모달 열기 버튼',
    });
    openModal('addPlace');
  }, [ensureAuthenticated, openModal, triggerEvent]);

  const handlePlaceSelect = useCallback(
    async (placeId: number, selected: boolean) => {
      if (!ensureAuthenticated()) return;

      if (selected) return;
      await handleAddRoutie(placeId);
    },
    [ensureAuthenticated, handleAddRoutie],
  );

  const handlePlaceDelete = useCallback(
    async (placeId: number) => {
      if (!ensureAuthenticated()) return;

      const confirmed = confirm('정말로 이 장소를 삭제하시겠습니까?');
      if (!confirmed) return;

      await handleDeletePlace(placeId);
    },
    [ensureAuthenticated, handleDeletePlace],
  );

  const handleLikeButtonClick = useCallback(
    (placeId: number) => {
      if (!ensureAuthenticated()) return;

      handleLikePlace(placeId);
    },
    [ensureAuthenticated, handleLikePlace],
  );

  const handleUnlikeButtonClick = useCallback(
    (placeId: number) => {
      if (!ensureAuthenticated()) return;

      handleDeleteLikePlace(placeId);
    },
    [ensureAuthenticated, handleDeleteLikePlace],
  );

  const handlePlaceEdit = useCallback((placeId: number) => {
    console.log(placeId);
  }, []);

  return (
    <Flex css={PlaceViewContainerStyle} direction="column" height="100%">
      <SearchBox />
      {placeList?.length === 0 && (
        <Flex height="100%">
          <EmptyMessage
            messages={[
              '추가된 장소가 없습니다.',
              '장소 추가하기 버튼을 이용하여 장소를 추가하세요!',
            ]}
          />
        </Flex>
      )}

      <Flex
        direction="column"
        justifyContent="flex-start"
        css={PlaceListContainerStyle}
        height="100%"
      >
        {placeList?.map((place) => {
          const selected = routieIdList.includes(place.id);
          const liked = likedPlaceIds.includes(place.id);
          return (
            <PlaceCard
              {...place}
              key={place.id}
              selected={selected}
              liked={liked}
              onSelect={handlePlaceSelect}
              onDelete={handlePlaceDelete}
              onLike={liked ? handleUnlikeButtonClick : handleLikeButtonClick}
              onEdit={handlePlaceEdit}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};

export default PlaceView;
