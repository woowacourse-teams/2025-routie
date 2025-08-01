import { useEffect } from 'react';

import { useRoutieContext } from '../../contexts/useRoutieContext';
import { useRoutieValidateContext } from '../../contexts/useRoutieValidateContext';
import { useCardDrag } from '../../hooks/useCardDrag';
import RoutieRoutes from '../Route/RoutieRoutes';
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

      {routiePlaces.length - 1 !== index && routes[index] && (
        <RoutieRoutes place={place} routes={routes[index]} />
      )}
    </div>
  ));
};

export default RoutieSection;
