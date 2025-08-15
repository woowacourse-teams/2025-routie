import { ReactNode, useState } from 'react';
import { css } from '@emotion/react';
import {
  sheetBase,
  sheetOpen,
  sheetClosed,
  tabBase,
  iconBase,
  iconFlipped,
  sheetContent,
} from './SideSheet.styles';
import CloseSheetIcon from '@/assets/icons/closeSheet.svg';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { usePlaceListContext } from '../PlaceList/contexts/PlaceListContext';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import { PlaceCard } from '@/domains/places/components/PlaceCard/PlaceCard';
import theme from '@/styles/theme';
import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';
import Button from '@/@common/components/Button/Button';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';
import AddPlaceModal from '@/domains/places/components/AddPlaceModal/AddPlaceModal';

type SideSheetProps = {
  open: boolean;
  onToggle: () => void;
  children?: ReactNode;
};

const SideSheet = ({ open, onToggle, children }: SideSheetProps) => {
  const { placeList, refetchPlaceList } = usePlaceListContext();
  const { routieIdList } = useRoutieContext();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { triggerEvent } = useGoogleEventTrigger();

  const openAddModal = () => {
    triggerEvent({
      action: 'click',
      category: 'place',
      label: '장소 추가하기 모달 열기 버튼',
    });
    setAddModalOpen((prev) => !prev);
  };

  const closeAddModal = () => {
    setAddModalOpen((prev) => !prev);
  };

  return (
    <aside
      css={[sheetBase, open ? sheetOpen : sheetClosed]}
      aria-hidden={!open}
    >
      <button
        css={[tabBase]}
        type="button"
        aria-label={open ? '사이드 시트 접기' : '사이드 시트 펼치기'}
        onClick={onToggle}
      >
        <img
          css={[iconBase, !open && iconFlipped]}
          src={CloseSheetIcon}
          alt={open ? '사이드 시트 닫기 버튼' : '사이드 시트 열기 버튼'}
        ></img>
      </button>
      <Flex
        direction="column"
        padding={3}
        alignItems="stretch"
        css={css`
          flex: 1;
          min-height: 0;
        `}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          padding={2}
        >
          <Text
            variant="title"
            css={css`
              width: 100%;
            `}
          >
            장소 목록
          </Text>
          <Button variant="primary" onClick={openAddModal}>
            <Flex width="100%">
              <Text variant="subTitle" color="white">
                + 장소 추가
              </Text>
            </Flex>
          </Button>
        </Flex>
        {placeList.length === 0 && (
          <EmptyMessage
            messages={[
              '추가된 장소가 없습니다.',
              '장소 추가하기 버튼을 이용하여 장소를 추가하세요!',
            ]}
          />
        )}
        <AddPlaceModal
          isOpen={addModalOpen}
          onClose={closeAddModal}
          onPlaceAdded={refetchPlaceList}
        />
        <div
          css={css`
            position: relative;
            flex: 1;
            min-height: 0;
          `}
        >
          <div
            css={css`
              overflow-y: auto;
              height: 100%;
              padding-right: 0.5rem;
            `}
          >
            <div css={sheetContent}>
              {placeList.map((place) => {
                const selected = routieIdList.includes(place.id);
                return (
                  <PlaceCard {...place} key={place.id} selected={selected} />
                );
              })}
            </div>
          </div>
        </div>
      </Flex>
    </aside>
  );
};

export default SideSheet;
