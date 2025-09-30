import { memo } from 'react';

import { css } from '@emotion/react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import LikeButton from '../LikeButton/LikeButton';

import type { PlaceCardProps } from './PlaceCard.types';

const PlaceCard = ({
  selected,
  onSelect,
  onDelete,
  onLike,
  ...props
}: PlaceCardProps) => {
  const handlePlaceSelect = async () => {
    await onSelect(props.id, selected);
  };

  return (
    <Card id={props.id.toString()} variant={selected ? 'available' : 'default'}>
      <Flex
        gap={1.6}
        justifyContent="space-between"
        height="8rem"
        padding="0.8rem 0.4rem"
      >
        <Flex direction="column" alignItems="flex-start" gap={1}>
          <Text variant="body" ellipsis>
            {props.name}
          </Text>
          <Text variant="caption" color={theme.colors.gray[200]} ellipsis>
            {props.roadAddressName || props.addressName}
          </Text>
          <LikeButton
            count={props.likeCount}
            onClick={() => onLike(props.id)}
          />
        </Flex>
        <Flex direction="column" gap={1.6} height="100%" width="auto">
          <Icon
            name={selected ? 'check' : 'plus'}
            onClick={handlePlaceSelect}
            size={selected ? 34 : 30}
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

          <Icon
            name={selected ? 'disableTrash' : 'trash'}
            onClick={selected ? undefined : () => onDelete(props.id)}
            size={30}
            css={css`
              cursor: ${selected ? 'default' : 'pointer'};
              padding: 0.4rem;
              border-radius: 8px;

              &:hover {
                background-color: ${selected
                  ? theme.colors.white
                  : theme.colors.red[50]};
              }
            `}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default memo(PlaceCard);
