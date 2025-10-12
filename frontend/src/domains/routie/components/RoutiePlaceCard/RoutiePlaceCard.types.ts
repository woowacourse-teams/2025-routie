import type { PlaceDataType } from '@/domains/places/types/place.types';

interface RoutiePlaceCardProps {
  place: PlaceDataType;
  onDelete: () => void;
}

export type { RoutiePlaceCardProps };
