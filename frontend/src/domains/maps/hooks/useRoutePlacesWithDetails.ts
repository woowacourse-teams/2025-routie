import { useMemo } from 'react';

import { usePlaceList } from '@/domains/places/hooks/usePlaceList';
import { useRoutieList } from '@/domains/routie/hooks/useRoutieList';

import type { RoutiePlaceWithDetails } from '../types/KaKaoMap.types';

const useRoutePlacesWithDetails = () => {
  const { placeList } = usePlaceList();
  const { routiePlaces } = useRoutieList();

  const routiePlacesWithDetails = useMemo<RoutiePlaceWithDetails[]>(() => {
    if (!placeList || !routiePlaces.length) return [];

    return routiePlaces
      .map((routiePlace) => {
        const placeDetail = placeList.find(place => place.id === routiePlace.placeId)!;

        return {
          ...placeDetail,
          sequence: routiePlace.sequence,
          routieId: routiePlace.id,
        };
      })
      .sort((a, b) => a.sequence - b.sequence);
  }, [placeList, routiePlaces]);

  return { routiePlacesWithDetails };
};

export { useRoutePlacesWithDetails };