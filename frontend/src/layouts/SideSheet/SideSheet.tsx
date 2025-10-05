import { useCallback } from 'react';

import Button from '@/@common/components/Button/Button';
import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useModal } from '@/@common/contexts/ModalContext';
import PlaceCard from '@/domains/places/components/PlaceCard/PlaceCard';
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
  const { placeList, handleDeletePlace, handleLikePlace, handleUnlikePlace } =
    usePlaceList();
  const { routieIdList, handleAddRoutie } = useRoutieList();
  const { openModal } = useModal();
  const { triggerEvent } = useGoogleEventTrigger();

  const handleOpenAddModalClick = useCallback(() => {
    triggerEvent({
      action: 'click',
      category: 'place',
      label: '장소 추가하기 모달 열기 버튼',
    });
    openModal('addPlace');
  }, [openModal, triggerEvent]);

  const handlePlaceSelect = useCallback(
    async (placeId: number, selected: boolean) => {
      if (selected) return;
      await handleAddRoutie(placeId);
    },
    [handleAddRoutie],
  );

  const handlePlaceDelete = useCallback(
    async (placeId: number) => {
      await handleDeletePlace(placeId);
    },
    [handleDeletePlace],
  );

  const handleLikeButtonClick = useCallback(
    (placeId: number) => {
      handleLikePlace(placeId);
    },
    [handleLikePlace],
  );

  const handleUnlikeButtonClick = useCallback(
    (placeId: number) => {
      handleUnlikePlace(placeId);
    },
    [handleUnlikePlace],
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
                return (
                  <PlaceCard
                    {...place}
                    key={place.id}
                    selected={selected}
                    onSelect={handlePlaceSelect}
                    onDelete={handlePlaceDelete}
                    onLike={handleLikeButtonClick}
                    onUnLike={handleUnlikeButtonClick}
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
