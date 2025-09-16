import { useState } from 'react';

import { css } from '@emotion/react';

import Button from '@/@common/components/Button/Button';
import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import CloseSheetIcon from '@/assets/icons/closeSheet.svg';
import AddPlaceModal from '@/domains/places/components/AddPlaceModal/AddPlaceModal';
import PlaceCard from '@/domains/places/components/PlaceCard/PlaceCard';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';
import theme from '@/styles/theme';

import {
  SheetBaseStyle,
  SheetContentContainerStyle,
  SheetOpenStyle,
  SheetCloseStyle,
  TabBaseStyle,
  IconBaseStyle,
  IconFlippedStyle,
  SheetListWrapperStyle,
  SheetScrollableAreaStyle,
} from './SideSheet.styles';

import type { SideSheetProps } from './SideSheet.types';

const SideSheet = ({ open, onToggle }: SideSheetProps) => {
  const { placeList } = usePlaceList();
  const { routieIdList } = useRoutieList();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { triggerEvent } = useGoogleEventTrigger();

  const handleOpenAddModalClick = () => {
    triggerEvent({
      action: 'click',
      category: 'place',
      label: '장소 추가하기 모달 열기 버튼',
    });
    setIsAddModalOpen((prev) => !prev);
  };

  const handleCloseAddModalClick = () => {
    setIsAddModalOpen(false);
  };

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
        <img
          css={[IconBaseStyle, !open && IconFlippedStyle]}
          src={CloseSheetIcon}
          alt={open ? '사이드 시트 닫기 버튼' : '사이드 시트 열기 버튼'}
        />
      </button>
      <Flex
        direction="column"
        alignItems="stretch"
        css={SheetContentContainerStyle}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          css={css`
            padding: 0 1rem 2rem;
          `}
        >
          <Text
            variant="title"
            css={css`
              width: 100%;
            `}
          >
            장소 목록
          </Text>
          <Button variant="primary" onClick={handleOpenAddModalClick}>
            <Flex width="100%">
              <Text variant="subTitle" color={theme.colors.white}>
                + 장소 추가
              </Text>
            </Flex>
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
        <AddPlaceModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModalClick}
        />
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
                  <PlaceCard {...place} key={place.id} selected={selected} />
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
