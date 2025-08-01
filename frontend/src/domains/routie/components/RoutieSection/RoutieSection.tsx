import { useEffect } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { MOVING_EN_TO_KR } from '../../constants/translate';
import { useRoutieContext } from '../../contexts/useRoutieContext';
import { useRoutieValidateContext } from '../../contexts/useRoutieValidateContext';
import { useCardDrag } from '../../hooks/useCardDrag';
import { convertMetersToKilometers } from '../../utils/format';
import RoutiePlaceCard from '../RoutiePlaceCard/RoutiePlaceCard';

const RoutieSection = () => {
  const { routiePlaces, routes, handleChangeRoutie } = useRoutieContext();
  const { validateRoutie } = useRoutieValidateContext();
  const getDragProps = useCardDrag(routiePlaces, handleChangeRoutie);

  useEffect(() => {
    if (!routiePlaces) return;

    const isSequenceChanged = routiePlaces.some(
      (item, index) => item.sequence !== index + 1,
    );

    const updateRoutiePlaces = async () => {
      if (routiePlaces.length > 0) {
        await validateRoutie();
      }
    };

    if (isSequenceChanged) {
      updateRoutiePlaces();
    }
  }, [routiePlaces]);

  return routiePlaces.map((place, index) => (
    <div key={place.placeId}>
      <div {...getDragProps(index)}>
        <RoutiePlaceCard placeId={place.placeId} />
      </div>

      {routiePlaces.length - 1 !== index && routes[index] && routes && (
        <Flex key={place.id + index} gap={1}>
          <Text variant="description">
            {MOVING_EN_TO_KR[routes[index].movingStrategy]}{' '}
            {routes[index].duration}분
          </Text>
          <Pill type="distance">
            <Text variant="description" color={theme.colors.purple[400]}>
              {convertMetersToKilometers(routes[index].distance)}km
            </Text>
          </Pill>
        </Flex>
      )}
    </div>
  ));
};

export default RoutieSection;
