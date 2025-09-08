import Flex from '@/@common/components/Flex/Flex';

import { useRoutieContext } from '../../contexts/useRoutieContext';
import { useCardDrag } from '../../hooks/useCardDrag';
import RoutiePlaceCard from '../RoutiePlaceCard/RoutiePlaceCard';

const RoutieSection = () => {
  const { routiePlaces, handleChangeRoutie } = useRoutieContext();
  const getDragProps = useCardDrag(routiePlaces, handleChangeRoutie);

  return (
    <Flex direction="column" width="100%" gap={2}>
      {routiePlaces.map((routie, index) => (
        <div key={routie.placeId} style={{ width: '100%' }}>
          <div {...getDragProps(index)} style={{ width: '100%' }}>
            <RoutiePlaceCard routie={routie} />
          </div>
        </div>
      ))}
    </Flex>
  );
};

export default RoutieSection;
