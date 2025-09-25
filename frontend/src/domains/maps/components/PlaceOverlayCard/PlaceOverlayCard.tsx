import { css } from '@emotion/react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import closeIcon from '@/assets/icons/close.svg';
import type { PlaceOverlayCardProps } from '@/domains/maps/types/map.types';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';
import theme from '@/styles/theme';

const PlaceOverlayCard = ({ place, onClose }: PlaceOverlayCardProps) => {
  const { routieIdList, handleAddRoutie } = useRoutieList();
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
        <Flex justifyContent="space-between">
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
          <IconButton icon="close" onClick={onClose} />
        </Flex>

        <Text variant="body" ellipsis>
          {place.name}
        </Text>
        <Text variant="caption" color={theme.colors.gray[200]} ellipsis>
          {place.roadAddressName || place.addressName}
        </Text>
      </Flex>
    </Card>
  );
};

export default PlaceOverlayCard;
