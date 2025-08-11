import { useRoutieContext } from '../../contexts/useRoutieContext';
import { useCardDrag } from '../../hooks/useCardDrag';
import RoutieRoutes from '../Route/RoutieRoutes';
import RoutiePlaceCard from '../RoutiePlaceCard/RoutiePlaceCard';

const RoutieSection = () => {
  const { routiePlaces, routes, handleChangeRoutie } = useRoutieContext();
  const getDragProps = useCardDrag(routiePlaces, handleChangeRoutie);

  return routiePlaces.map((routie, index) => (
    <div key={routie.placeId} style={{ width: '100%' }}>
      <div {...getDragProps(index)} style={{ width: '100%' }}>
        <RoutiePlaceCard routie={routie} />
      </div>

      {routiePlaces.length - 1 !== index && routes[index] && (
        <RoutieRoutes routie={routie} routes={routes[index]} />
      )}
    </div>
  ));
};

export default RoutieSection;
