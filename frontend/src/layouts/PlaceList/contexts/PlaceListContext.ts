import { createContext, useContext } from 'react';

import { PlaceFetchType } from '@/domains/places/types/place.types';

export interface PlaceListContextType {
  placeList: PlaceFetchType[];
  refetchPlaceList: () => Promise<void>;
  handleDelete: (id: number) => void;
  newlyAddedPlace: PlaceFetchType | null;
  handlePlaceAdded: () => Promise<void>;
}

export const PlaceListContext = createContext<PlaceListContextType | null>(
  null,
);

export const usePlaceListContext = () => {
  const context = useContext(PlaceListContext);
  if (!context) throw new Error('PlaceListProvider 내부에서만 사용하세요.');
  return context;
};
