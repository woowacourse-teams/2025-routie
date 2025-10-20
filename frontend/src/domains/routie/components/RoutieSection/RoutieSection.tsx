import { useCallback, useMemo } from 'react';

import { useCardDrag } from '@/@common/hooks/useCardDrag';
import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import RoutiePlaceItem from '@/domains/routie/components/RoutiePlaceItem/RoutiePlaceItem';
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
      <RoutiePlaceItem
        key={routiePlace.placeId}
        routie={routiePlace}
        place={place}
        index={index}
        isFirst={index === 0}
        isLast={index === routiePlaces.length - 1}
        onDelete={handleDeleteRoutieClick}
        getDragProps={getDragProps}
      />
    );
  });
};

export default RoutieSection;
