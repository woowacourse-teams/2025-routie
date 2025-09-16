import Flex from '@/@common/components/Flex/Flex';
import { useCardDrag } from '@/@common/hooks/useCardDrag';
import RoutiePlaceCard from '@/domains/routie/components/RoutiePlaceCard/RoutiePlaceCard';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';

const RoutieSection = () => {
  const { routiePlaces, handleChangeRoutie } = useRoutieList();
  const getDragProps = useCardDrag(routiePlaces, handleChangeRoutie);

  return (
    <Flex direction="column" width="100%" gap={2}>
      {routiePlaces.map((routiePlace, index) => (
        <div key={routiePlace.placeId} css={{ width: '100%' }}>
          <div {...getDragProps(index)} css={{ width: '100%' }}>
            <RoutiePlaceCard routie={routiePlace} />
          </div>
        </div>
      ))}
    </Flex>
  );
};

export default RoutieSection;
