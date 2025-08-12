import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import IconButton from '@/@common/components/IconButton/IconButton';
import Pill from '@/@common/components/Pill/Pill';
import plusIcon from '@/assets/icons/plus.svg';
import checkIcon from '@/assets/icons/check.svg';
import closeIcon from '@/assets/icons/close.svg';
import theme from '@/styles/theme';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import type { PlaceCardProps } from '@/domains/places/components/PlaceCard/PlaceCard';

type Props = {
  place: PlaceCardProps;
  onClose: () => void;
};

const PlaceOverlayCard = ({ place, onClose }: Props) => {
  const { routieIdList, handleAddRoutie } = useRoutieContext();
  const selected = routieIdList.includes(place.id);

  const handleSelect = async () => {
    if (selected) return;
    await handleAddRoutie(place.id);
  };

  return (
    <Card
      id={'placeOverlayCard'}
      width="20rem"
      variant={selected ? 'available' : 'default'}
    >
      <Flex direction="column" gap={1.2} alignItems="flex-start">
        <Flex justifyContent="space-between" alignItems="center" width="100%">
          <IconButton
            icon={selected ? checkIcon : plusIcon}
            variant={selected ? 'selected' : 'select'}
            onClick={handleSelect}
          />
          <IconButton icon={closeIcon} onClick={onClose} />
        </Flex>

        <Text variant="subTitle">{place.name}</Text>
        <Text variant="caption" color={theme.colors.gray[200]}>
          {place.roadAddressName}
        </Text>
        <Pill type="time">
          {place.openAt}-{place.closeAt}
        </Pill>
      </Flex>
    </Card>
  );
};

export default PlaceOverlayCard;
