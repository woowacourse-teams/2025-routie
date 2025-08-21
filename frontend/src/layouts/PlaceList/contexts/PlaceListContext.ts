import { createContext, useContext } from 'react';

import { PlaceCardProps } from '@/domains/places/components/PlaceCard/PlaceCard';

export interface PlaceListContextType {
  placeList: PlaceCardProps[];
  refetchPlaceList: () => Promise<void>;
  handleDelete: (id: number) => void;
  newlyAddedPlace: PlaceCardProps | null;
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
