import { useEffect, useState } from 'react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import closeRed from '@/assets/icons/close-red.svg';
import { PlaceBaseType } from '@/domains/places/types/place.types';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';
import theme from '@/styles/theme';

import { getDetailPlace } from '../../apis/routie';
import { useRoutieContext } from '../../contexts/useRoutieContext';
import DraggableWrapper from '../DraggableWrapper/DraggableWrapper';

import { dragIconStyle, EllipsisParentStyle } from './RoutiePlaceCard.styles';

import type { RoutieType } from '../../types/routie.types';

const RoutiePlaceCard = ({ routie }: { routie: RoutieType }) => {
  const [place, setPlace] = useState<PlaceBaseType>({
    name: '',
    roadAddressName: '',
    addressName: '',
    longitude: 0,
    latitude: 0,
  });

  const { handleDeleteRoutie } = useRoutieContext();
  const { triggerEvent } = useGoogleEventTrigger();
  const { showToast } = useToastContext();

  useEffect(() => {
    const fetchDetailPlace = async () => {
      try {
        const detailPlace = await getDetailPlace(routie.placeId);
        setPlace(detailPlace);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          showToast({
            message: error.message,
            type: 'error',
          });
        }
      }
    };
    fetchDetailPlace();
  }, [routie]);

  const handleDelete = () => {
    handleDeleteRoutie(routie.placeId);
    triggerEvent({
      action: 'click',
      category: 'routie',
      label: '루티에서 장소 삭제하기 버튼',
    });
  };

  return (
    place && (
      <DraggableWrapper>
        <Card id={routie.placeId.toString()} variant={'defaultStatic'}>
          <Flex justifyContent="flex-start" gap={1.5}>
            <Flex width="100%" justifyContent="space-between" gap={1.5}>
              <Flex padding={1}>
                <Text variant="title" color={theme.colors.purple[300]}>
                  {routie.sequence}
                </Text>
              </Flex>
              <Flex
                direction="column"
                alignItems="flex-start"
                gap={1.1}
                width="100%"
                padding={0.5}
                css={EllipsisParentStyle}
              >
                <Flex width="100%" justifyContent="space-between" gap={1}>
                  <Text variant="caption" ellipsis>
                    {place.name}
                  </Text>
                </Flex>

                <Flex gap={0.4} alignItems="center">
                  <Icon name="pin" size={12} />
                  <Text variant="label" color={theme.colors.gray[300]} ellipsis>
                    {place.roadAddressName || place.addressName}
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="column" gap={3}>
                <IconButton
                  icon={closeRed}
                  variant="delete"
                  onClick={handleDelete}
                />
                <Icon name="drag" size={24} css={dragIconStyle} />
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </DraggableWrapper>
    )
  );
};

export default RoutiePlaceCard;
