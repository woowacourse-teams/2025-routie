import { createContext, useContext } from 'react';

import { PlaceCardProps } from '@/domains/places/components/PlaceCard/PlaceCard';

export const PlaceListContext = createContext<PlaceCardProps[]>([]);

export const usePlaceListContext = () => useContext(PlaceListContext);
