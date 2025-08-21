import { css } from '@emotion/react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Icon from '@/@common/components/IconSvg/Icon';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import closeIcon from '@/assets/icons/close.svg';
import type { PlaceCardProps } from '@/domains/places/components/PlaceCard/PlaceCard';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';
import theme from '@/styles/theme';

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
    onClose();
  };

  return (
    <Card
      id={'placeOverlayCard'}
      width="20rem"
      variant={selected ? 'available' : 'default'}
    >
      <Flex direction="column" gap={1.2} alignItems="flex-start">
        <Flex justifyContent="space-between" width="100%">
          <Icon
            name={selected ? 'check' : 'plus'}
            size={selected ? 34 : 28}
            onClick={handleSelect}
            css={css`
              cursor: ${selected ? 'default' : 'pointer'};
              padding: 0.2rem;
              border-radius: 8px;

              &:hover {
                background-color: ${selected
                  ? theme.colors.white
                  : theme.colors.purple[200]};
              }
            `}
          />
          <IconButton icon={closeIcon} onClick={onClose} />
        </Flex>

        <Text variant="subTitle" ellipsis>
          {place.name}
        </Text>
        <Text variant="caption" color={theme.colors.gray[200]} ellipsis>
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
