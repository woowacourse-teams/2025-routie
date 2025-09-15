import type { PlaceDataType } from '@/domains/places/types/place.types';

interface PlaceOverlayCardProps {
  place: PlaceDataType;
  onClose: () => void;
}

export type { PlaceOverlayCardProps };
