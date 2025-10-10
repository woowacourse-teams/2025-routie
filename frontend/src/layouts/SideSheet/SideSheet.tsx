import { useCallback } from 'react';

import Button from '@/@common/components/Button/Button';
import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useModal } from '@/@common/contexts/ModalContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import PlaceCard from '@/domains/places/components/PlaceCard/PlaceCard';
import { usePlaceLikes } from '@/domains/places/hooks/usePlaceLikes';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';
import theme from '@/styles/theme';

import {
  IconBaseStyle,
  IconFlippedStyle,
  SheetBaseStyle,
  SheetCloseStyle,
  SheetContentContainerStyle,
  SheetListWrapperStyle,
  SheetOpenStyle,
  SheetScrollableAreaStyle,
  TabBaseStyle,
} from './SideSheet.styles';

import type { SideSheetProps } from './SideSheet.types';

const SideSheet = ({ open, onToggle }: SideSheetProps) => {
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

  return (
    <aside
      css={[SheetBaseStyle, open ? SheetOpenStyle : SheetCloseStyle]}
      aria-hidden={!open}
    >
      <button
        css={[TabBaseStyle]}
        aria-label={open ? '사이드 시트 접기' : '사이드 시트 펼치기'}
        onClick={onToggle}
      >
        <Icon
          name="closeSheetIcon"
          alt={open ? '사이드 시트 닫기 버튼' : '사이드 시트 열기 버튼'}
          css={[IconBaseStyle, !open && IconFlippedStyle]}
        />
      </button>
      <Flex
        direction="column"
        alignItems="stretch"
        css={SheetContentContainerStyle}
      >
        <Flex justifyContent="space-between" padding="0 1rem 2rem">
          <Text variant="title">장소 목록</Text>
          <Button
            variant="primary"
            onClick={handleOpenAddModalClick}
            width="50%"
          >
            <Text variant="body" color={theme.colors.white}>
              + 장소 추가
            </Text>
          </Button>
        </Flex>
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
        <div css={SheetListWrapperStyle}>
          <div css={SheetScrollableAreaStyle}>
            <Flex
              direction="column"
              justifyContent="flex-start"
              gap={2}
              css={{ overflowY: 'visible' }}
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
                    onLike={
                      liked ? handleUnlikeButtonClick : handleLikeButtonClick
                    }
                  />
                );
              })}
            </Flex>
          </div>
        </div>
      </Flex>
    </aside>
  );
};

export default SideSheet;
