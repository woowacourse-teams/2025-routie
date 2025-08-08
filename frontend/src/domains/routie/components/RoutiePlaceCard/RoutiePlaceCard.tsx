import { useEffect, useState } from 'react';

import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import dragIcon from '@/assets/icons/drag.svg';
import minusIcon from '@/assets/icons/minus.svg';
import { useGoogleEventTrigger } from '@/libs/googleAnalytics/hooks/useGoogleEventTrigger';

import { getDetailPlace } from '../../apis/routie';
import { useRoutieContext } from '../../contexts/useRoutieContext';
import { Routie, RoutiePlace } from '../../types/routie.types';

const RoutiePlaceCard = ({ routie }: { routie: Routie }) => {
  const [place, setPlace] = useState<RoutiePlace>();
  const { handleDeleteRoutie } = useRoutieContext();
  const { triggerEvent } = useGoogleEventTrigger();

  useEffect(() => {
    const fetchDetailPlace = async () => {
      const detailPlace = await getDetailPlace(routie.placeId);
      setPlace(detailPlace);
    };
    fetchDetailPlace();
  }, [routie.placeId]);

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
      <Card id={routie.placeId.toString()} variant="defaultStatic">
        <Flex justifyContent="flex-start" gap={1.5}>
          <IconButton variant="drag" icon={dragIcon} onClick={() => {}} />
          <Flex
            direction="column"
            alignItems="flex-start"
            gap={1.1}
            width="100%"
          >
            <Flex width="100%" justifyContent="space-between">
              <Text variant="caption">{place.name}</Text>
              <Flex gap={0.4}>
                <IconButton
                  icon={minusIcon}
                  variant="delete"
                  onClick={handleDelete}
                />
              </Flex>
            </Flex>
            <Pill type="time">
              {routie.arriveDateTime?.slice(-5)}-
              {routie.departureDateTime?.slice(-5)}{' '}
              <Pill type="distance">{place.stayDurationMinutes}분</Pill>
            </Pill>
          </Flex>
        </Flex>
      </Card>
    )
  );
};

export default RoutiePlaceCard;
