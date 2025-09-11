import type { PlaceFetchType } from '@/domains/places/types/place.types';

interface PlaceOverlayCardProps {
  place: PlaceFetchType;
  onClose: () => void;
}

export type { PlaceOverlayCardProps };
