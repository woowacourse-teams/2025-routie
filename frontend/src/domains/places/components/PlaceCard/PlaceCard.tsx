/** @jsxImportSource @emotion/react */
import { memo } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import LikeButton from '@/domains/places/components/LikeButton/LikeButton';
import theme from '@/styles/theme';

import type { PlaceCardProps } from './PlaceCard.types';

const PlaceCard = ({
  selected,
  liked,
  onSelect,
  onDelete,
  onEdit,
  onLike,
  ...props
}: PlaceCardProps) => {
  const handlePlaceSelect = async () => {
    await onSelect(props.id, selected);
  };

  return (
    <Flex
      id={props.id.toString()}
      direction="column"
      gap={1.6}
      padding="1.6rem"
    >
      <Flex justifyContent="space-between" alignItems="flex-start" gap={1.6}>
        <Flex
          direction="column"
          alignItems="flex-start"
          gap={1}
          flex={1}
          maxWidth="70%"
        >
          <Text variant="body" ellipsis color={theme.colors.gray[300]}>
            {props.name}
          </Text>
          <Text variant="caption" color={theme.colors.gray[200]} ellipsis>
            {props.roadAddressName || props.addressName}
          </Text>
          <Flex justifyContent="flex-start" gap={1}>
            {props.hashtags?.map((hashtag, index) => (
              <Text
                key={index}
                variant="caption"
                color={theme.colors.blue[400]}
                css={{ whiteSpace: 'nowrap' }}
              >
                {hashtag}
              </Text>
            ))}
          </Flex>
        </Flex>
        <Button
          variant="primary"
          onClick={handlePlaceSelect}
          disabled={selected}
          padding="0.6rem 1.2rem"
          width="10rem"
        >
          <Text variant="caption" color={theme.colors.white}>
            동선에 추가
          </Text>
        </Button>
      </Flex>
      <Flex justifyContent="space-between">
        <LikeButton
          count={props.likeCount}
          liked={liked}
          onClick={() => onLike(props.id)}
        />
        <Flex justifyContent="space-between" width="10rem">
          <Button
            variant="secondary"
            onClick={() => onEdit(props.id)}
            padding="0.6rem 1.2rem"
            width="auto"
          >
            <Text variant="label" color={theme.colors.gray[300]}>
              수정
            </Text>
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(props.id)}
            padding="0.6rem 1.2rem"
            width="auto"
          >
            <Text variant="label" color={theme.colors.gray[300]}>
              삭제
            </Text>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(PlaceCard);
