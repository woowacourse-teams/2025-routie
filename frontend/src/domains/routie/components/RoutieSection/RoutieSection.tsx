import { useCallback } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import { useCardDrag } from '@/@common/hooks/useCardDrag';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import RoutiePlaceCard from '@/domains/routie/components/RoutiePlaceCard/RoutiePlaceCard';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';

const RoutieSection = () => {
  const { routiePlaces, handleChangeRoutie, handleDeleteRoutie } =
    useRoutieList();
  const { placeList } = usePlaceList();
  const getDragProps = useCardDrag(routiePlaces, handleChangeRoutie);

  const handleDeleteRoutieClick = useCallback(
    (placeId: number) => {
      handleDeleteRoutie(placeId);
    },
    [handleDeleteRoutie],
  );

  return (
    <Flex direction="column" gap={2}>
      {routiePlaces.map((routiePlace, index) => {
        const place = placeList?.find(
          (place) => place.id === routiePlace.placeId,
        );
        if (!place) return null;
        return (
          <div
            key={routiePlace.placeId}
            {...getDragProps(index)}
            css={{ width: '100%' }}
          >
            <RoutiePlaceCard
              routie={routiePlace}
              place={place!}
              onDelete={handleDeleteRoutieClick}
            />
          </div>
        );
      })}
    </Flex>
  );
};

export default RoutieSection;
