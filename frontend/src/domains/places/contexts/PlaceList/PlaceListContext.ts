import { createContext, useContext } from 'react';

import type { PlaceListContextType } from '@/domains/places/types/place.types';

const PlaceListContext = createContext<PlaceListContextType | null>(null);

const usePlaceListContext = () => {
  const context = useContext(PlaceListContext);
  if (!context) throw new Error('PlaceListProvider 내부에서만 사용하세요.');
  return context;
};

export { PlaceListContext, usePlaceListContext };
