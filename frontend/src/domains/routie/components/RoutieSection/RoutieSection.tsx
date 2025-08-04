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
    if (routiePlaces.length <= 0) return;

    const isSequenceChanged = routiePlaces.some(
      (item, index) => item.sequence !== index + 1,
    );

    if (!isSequenceChanged) return;

    const updateRoutiePlaces = async () => {
      await validateRoutie();
    };
    updateRoutiePlaces();
  }, [routiePlaces]);

  return routiePlaces.map((routie, index) => (
    <div key={routie.placeId}>
      <div {...getDragProps(index)}>
        <RoutiePlaceCard routie={routie} />
      </div>

      {routiePlaces.length - 1 !== index && routes[index] && (
        <RoutieRoutes routie={routie} routes={routes[index]} />
      )}
    </div>
  ));
};

export default RoutieSection;
