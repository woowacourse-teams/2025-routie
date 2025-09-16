import { useEffect } from 'react';

import Card from '@/@common/components/Card/Card';
import DraggableWrapper from '@/@common/components/DraggableWrapper/DraggableWrapper';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import closeRed from '@/assets/icons/close-red.svg';
import { usePlaceDetailQuery } from '@/domains/places/queries/usePlaceQuery';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';
import type { RoutieType } from '@/domains/routie/types/routie.types';
import theme from '@/styles/theme';

import { DragIconStyle, EllipsisParentStyle } from './RoutiePlaceCard.styles';

const RoutiePlaceCard = ({ routie }: { routie: RoutieType }) => {
  const { data: place, error } = usePlaceDetailQuery(routie.placeId);
  const { handleDeleteRoutie } = useRoutieList();
  const { showToast } = useToastContext();

  useEffect(() => {
    if (error) {
      console.error(error);
      if (error instanceof Error) {
        showToast({
          message: error.message,
          type: 'error',
        });
      }
    }
  }, [error]);

  return (
    place && (
      <DraggableWrapper>
        <Card id={routie.placeId.toString()} variant={'defaultStatic'}>
          <Flex justifyContent="space-between" gap={1.5}>
            <Flex padding={1} width="auto">
              <Text variant="title" color={theme.colors.purple[300]}>
                {routie.sequence}
              </Text>
            </Flex>
            <Flex
              direction="column"
              alignItems="flex-start"
              gap={1.1}
              padding={0.5}
              css={EllipsisParentStyle}
            >
              <Text variant="caption" ellipsis>
                {place.name}
              </Text>
              <Flex gap={0.4} justifyContent="flex-start">
                <Icon name="pin" size={12} />
                <Text variant="label" color={theme.colors.gray[300]} ellipsis>
                  {place.roadAddressName || place.addressName}
                </Text>
              </Flex>
            </Flex>
            <Flex direction="column" gap={3} width="auto">
              <IconButton
                icon={closeRed}
                variant="delete"
                onClick={() => handleDeleteRoutie(routie.placeId)}
              />
              <Icon name="drag" size={24} css={DragIconStyle} />
            </Flex>
          </Flex>
        </Card>
      </DraggableWrapper>
    )
  );
};

export default RoutiePlaceCard;
