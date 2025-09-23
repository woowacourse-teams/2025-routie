import type { PlaceDataType } from '@/domains/places/types/place.types';

interface PlaceCardProps extends PlaceDataType {
  selected: boolean;
  onSelect: (placeId: number, selected: boolean) => Promise<void>;
  onDelete: (placeId: number) => Promise<void>;
}

export type { PlaceCardProps };
