import type { PlaceDataType } from '@/domains/places/types/place.types';

interface RoutiePlaceCardProps {
  place: PlaceDataType;
  onDelete: (placeId: number) => void;
}

export type { RoutiePlaceCardProps };
