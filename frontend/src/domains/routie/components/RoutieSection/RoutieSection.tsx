import { useEffect } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Pill from '@/@common/components/Pill/Pill';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { editRoutieSequence } from '../../apis/routie';
import { MOVING_EN_TO_KR } from '../../constants/translate';
import { useRoutieContext } from '../../contexts/useRoutieContext';
import { useRoutieValidateContext } from '../../contexts/useRoutieValidateContext';
import { useCardDrag } from '../../hooks/useCardDrag';
import { Routie } from '../../types/routie.types';
import { convertMetersToKilometers } from '../../utils/format';
import RoutiePlaceCard from '../RoutiePlaceCard/RoutiePlaceCard';

interface RoutieSectionProps {
  onPlaceChange: () => Promise<void>;
}

const RoutieSection = ({ onPlaceChange }: RoutieSectionProps) => {
  const { routiePlaces, routes, handleRoutieChange } = useRoutieContext();
  const getDragProps = useCardDrag(routiePlaces, handleRoutieChange);
  const { validateRoutie } = useRoutieValidateContext();
  useEffect(() => {
    if (!routiePlaces) return;

    const updated = routiePlaces.map((item, index) => ({
      ...item,
      sequence: index + 1,
    }));

    const isSequenceChanged = routiePlaces.some(
      (item, index) => item.sequence !== index + 1,
    );

    const updateRoutiePlaces = async (sortedPlaces: Routie[]) => {
      handleRoutieChange(sortedPlaces);
      await editRoutieSequence(sortedPlaces);
      await validateRoutie();
    };

    if (isSequenceChanged) {
      const sortedPlaces = updated.sort((a, b) => a.sequence - b.sequence);
      updateRoutiePlaces(sortedPlaces);
    }
  }, [routiePlaces]);

  return routiePlaces.map((place, index) => (
    <>
      <div key={place.placeId} {...getDragProps(index)}>
        <RoutiePlaceCard
          placeId={place.placeId}
          onPlaceChange={onPlaceChange}
        />
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
    </>
  ));
};

export default RoutieSection;
