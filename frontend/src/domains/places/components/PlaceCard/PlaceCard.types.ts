import type { PlaceDataType } from '@/domains/places/types/place.types';

interface PlaceCardProps extends PlaceDataType {
  selected: boolean;
}

export type { PlaceCardProps };
