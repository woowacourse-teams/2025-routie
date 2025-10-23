import { useCallback, useMemo, useState } from 'react';

import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import { useModal } from '@/@common/contexts/ModalContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import PlaceCard from '@/domains/places/components/PlaceCard/PlaceCard';
import SearchBox from '@/domains/places/components/SearchBox/SearchBox';
import { useHashtagFilterContext } from '@/domains/places/contexts/useHashtagFilterContext';
import { usePlaceLikes } from '@/domains/places/hooks/usePlaceLikes';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { filterPlacesByHashtags } from '@/domains/places/utils/filterPlaces';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';
import {
  PlaceViewContainerStyle,
  PlaceListContainerStyle,
  PlaceCardContainerStyle,
} from '@/pages/RoutieSpace/components/PlaceView/PlaceView.styles';

const PlaceView = () => {
  const { placeList, handleDeletePlace, handleUpdatePlaceHashtags } =
    usePlaceList();
  const { handleLikePlace, handleDeleteLikePlace, likedPlaceIds } =
    usePlaceLikes();
  const { routieIdList, handleAddRoutie, handleDeleteRoutie } = useRoutieList();
  const { openModal } = useModal();
  const { selectedHashtags } = useHashtagFilterContext();
  const [editingPlaceId, setEditingPlaceId] = useState<number | null>(null);

  const filteredPlaceList = useMemo(() => {
    if (!placeList) return [];

    return filterPlacesByHashtags({
      places: placeList,
      selectedHashtags,
    });
  }, [placeList, selectedHashtags]);

  const ensureAuthenticated = useCallback(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      openModal('login');
      return false;
    }
    return true;
  }, [openModal]);

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

  const handlePlaceEdit = useCallback(
    (placeId: number) => {
      if (!ensureAuthenticated()) return;
      setEditingPlaceId(placeId);
    },
    [ensureAuthenticated],
  );

  const handleCloseEditModal = useCallback(() => {
    setEditingPlaceId(null);
  }, []);

  const handleUpdateHashtags = useCallback(
    async (placeId: number, hashtags: string[]) => {
      await handleUpdatePlaceHashtags(placeId, hashtags);
      setEditingPlaceId(null);
    },
    [handleUpdatePlaceHashtags],
  );

  const handleReturnFocusToSidebar = useCallback(() => {
    document.getElementById('sideBar')?.focus();
  }, []);

  return (
    <Flex direction="column" height="100%" css={PlaceViewContainerStyle}>
      <SearchBox />

      {placeList?.length === 0 ? (
        <Flex height="100%">
          <EmptyMessage
            messages={[
              '추가된 장소가 없습니다.',
              '장소 추가하기 버튼을 이용하여 장소를 추가하세요!',
            ]}
          />
        </Flex>
      ) : filteredPlaceList.length === 0 ? (
        <Flex height="100%">
          <EmptyMessage
            messages={[
              '선택된 해시태그와 일치하는 장소가 없습니다.',
              '다른 해시태그를 선택해보세요!',
            ]}
          />
        </Flex>
      ) : (
        <Flex
          direction="column"
          justifyContent="flex-start"
          css={PlaceListContainerStyle}
          height="100%"
        >
          {filteredPlaceList.map((place) => {
            const selected = routieIdList.includes(place.id);
            const liked = likedPlaceIds.includes(place.id);
            const isEditing = editingPlaceId === place.id;

            return (
              <section key={place.id} css={PlaceCardContainerStyle}>
                <PlaceCard
                  {...place}
                  selected={selected}
                  liked={liked}
                  isEditing={isEditing}
                  onSelect={handlePlaceSelect}
                  onDelete={handlePlaceDelete}
                  onDeleteRoutie={handleDeleteRoutie}
                  onLike={
                    liked ? handleUnlikeButtonClick : handleLikeButtonClick
                  }
                  onEdit={handlePlaceEdit}
                  onCancelEdit={handleCloseEditModal}
                  onUpdateHashtags={(hashtags) =>
                    handleUpdateHashtags(place.id, hashtags)
                  }
                />
              </section>
            );
          })}
          <span
            tabIndex={0}
            onFocus={handleReturnFocusToSidebar}
            className="hide"
            aria-label="사이드바로 이동"
          />
        </Flex>
      )}
    </Flex>
  );
};

export default PlaceView;
