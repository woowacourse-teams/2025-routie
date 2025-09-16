import Flex from '@/@common/components/Flex/Flex';
import { useCardDrag } from '@/@common/hooks/useCardDrag';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';

import RoutiePlaceCard from '../RoutiePlaceCard/RoutiePlaceCard';

const RoutieSection = () => {
  const { routiePlaces, handleChangeRoutie } = useRoutieList();
  const getDragProps = useCardDrag(routiePlaces, handleChangeRoutie);

  return (
    <Flex direction="column" gap={2}>
      {routiePlaces.map((routiePlace, index) => (
        <div key={routiePlace.placeId} style={{ width: '100%' }}>
          <div {...getDragProps(index)} style={{ width: '100%' }}>
            <RoutiePlaceCard routie={routiePlace} />
          </div>
        </div>
      ))}
    </Flex>
  );
};

export default RoutieSection;
