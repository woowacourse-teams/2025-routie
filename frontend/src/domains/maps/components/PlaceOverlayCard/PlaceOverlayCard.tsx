import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Text from '@/@common/components/Text/Text';
import type { PlaceOverlayCardProps } from '@/domains/maps/types/map.types';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';
import theme from '@/styles/theme';

import { PlaceOverlayCardContainerStyle } from './PlaceOverlayCard.styles';

const PlaceOverlayCard = ({ place, onClose }: PlaceOverlayCardProps) => {
  const { routieIdList, handleAddRoutie, handleDeleteRoutie } = useRoutieList();
  const selected = routieIdList.includes(place.id);

  const handleSelect = async () => {
    if (selected) return;
    await handleAddRoutie(place.id);
    onClose();
  };

  const handleDelete = async () => {
    if (!selected) return;
    await handleDeleteRoutie(place.id);
    onClose();
  };

  return (
    <Flex
      direction="column"
      alignItems="flex-start"
      gap={1}
      css={PlaceOverlayCardContainerStyle}
      width="21rem"
      padding="1rem"
    >
      <Flex justifyContent="space-between">
        <Text variant="body" ellipsis>
          {place.name}
        </Text>
        <IconButton icon="close" onClick={onClose} />
      </Flex>

      <Text variant="label" color={theme.colors.gray[200]} ellipsis>
        {place.roadAddressName || place.addressName}
      </Text>
      <Button
        variant={selected ? 'dangerSecondary' : 'primary'}
        onClick={selected ? handleDelete : handleSelect}
        width="8rem"
        padding="0.6rem"
      >
        <Text variant="label" color={theme.colors.white}>
          {selected ? '동선에서 삭제' : '동선에 추가'}
        </Text>
      </Button>
    </Flex>
  );
};

export default PlaceOverlayCard;
