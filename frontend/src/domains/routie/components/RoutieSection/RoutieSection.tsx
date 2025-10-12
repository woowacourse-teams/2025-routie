import { useCallback, useMemo } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import { useCardDrag } from '@/@common/hooks/useCardDrag';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import RoutiePlaceCard from '@/domains/routie/components/RoutiePlaceCard/RoutiePlaceCard';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';

const RoutieSection = () => {
  const { routiePlaces, handleChangeRoutie, handleDeleteRoutie } =
    useRoutieList();
  const { placeList } = usePlaceList();

  const placeMap = useMemo(
    () => new Map(placeList?.map((place) => [place.id, place]) || []),
    [placeList],
  );

  const getDragProps = useCardDrag(routiePlaces, handleChangeRoutie);

  const handleDeleteRoutieClick = useCallback(
    (placeId: number) => {
      handleDeleteRoutie(placeId);
    },
    [handleDeleteRoutie],
  );

  return routiePlaces.map((routiePlace, index) => {
    const place = placeMap.get(routiePlace.placeId);
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
  });
};

export default RoutieSection;
