/** @jsxImportSource @emotion/react */
import { memo } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { formatHashtag } from '@/@common/utils/format';
import EditHashtagDropdown from '@/domains/places/components/EditHashtagDropdown/EditHashtagDropdown';
import LikeButton from '@/domains/places/components/LikeButton/LikeButton';
import theme from '@/styles/theme';

import type { PlaceCardProps } from './PlaceCard.types';

const PlaceCard = ({
  selected,
  liked,
  isEditing = false,
  onSelect,
  onDelete,
  onEdit,
  onLike,
  onCancelEdit,
  onUpdateHashtags,
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
          <Flex justifyContent="flex-start" gap={0.5} css={{ flexWrap: 'wrap' }}>
            {props.hashtags?.length ? (
              props.hashtags.map((hashtag) => (
                <Text
                  key={hashtag}
                  variant="caption"
                  color={theme.colors.blue[400]}
                  css={{ whiteSpace: 'nowrap' }}
                >
                  {formatHashtag(hashtag)}
                </Text>
              ))
            ) : (
              <Text variant="caption" color={theme.colors.gray[100]}>
                #
              </Text>
            )}
            {!isEditing && (
              <Icon
                name="edit"
                size={16}
                onClick={() => onEdit(props.id)}
                css={{ cursor: 'pointer', marginLeft: '0.4rem' }}
              />
            )}
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

      {isEditing && onCancelEdit && onUpdateHashtags && (
        <Flex direction="column" gap={1.6}>
          <EditHashtagDropdown
            initialHashtags={props.hashtags || []}
            onCancel={onCancelEdit}
            onUpdate={onUpdateHashtags}
          />
          <Flex justifyContent="space-between">
            <LikeButton
              count={props.likeCount}
              liked={liked}
              onClick={() => onLike(props.id)}
            />
            <Flex justifyContent="flex-end" width="15rem">
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
      )}

      {!isEditing && (
        <Flex justifyContent="space-between">
          <LikeButton
            count={props.likeCount}
            liked={liked}
            onClick={() => onLike(props.id)}
          />
          <Flex justifyContent="flex-end" width="15rem">
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
      )}
    </Flex>
  );
};

export default memo(PlaceCard);
