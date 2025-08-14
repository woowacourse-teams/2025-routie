import { ReactNode } from 'react';
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

type SideSheetProps = {
  open: boolean;
  onToggle: () => void;
  children?: ReactNode;
};

const SideSheet = ({ open, onToggle, children }: SideSheetProps) => {
  const { placeList } = usePlaceListContext();
  const { routieIdList } = useRoutieContext();

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
        css={{ flex: 1, minHeight: 0 }}
      >
        <Text
          variant="title"
          css={{
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
            borderBottom: `1px solid ${theme.colors.gray[100]}`,
            width: '100%',
          }}
        >
          장소 목록
        </Text>
        {placeList.length === 0 && (
          <EmptyMessage
            messages={[
              '추가된 장소가 없습니다.',
              '장소 추가하기 버튼을 이용하여 장소를 추가하세요!',
            ]}
          />
        )}
        <div
          css={{
            flex: 1,
            minHeight: 0,
            position: 'relative',
          }}
        >
          <div
            css={{ overflowY: 'auto', height: '100%', paddingRight: '0.5rem' }}
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
