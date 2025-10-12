import type { PlaceWithLikeType } from '@/domains/places/types/place.types';

interface PlaceCardProps extends PlaceWithLikeType {
  selected: boolean;
  liked: boolean;
  onSelect: (placeId: number, selected: boolean) => Promise<void>;
  onDelete: (placeId: number) => Promise<void>;
  onLike: (placeId: number) => void | Promise<void>;
  onEdit: (placeId: number) => void | Promise<void>;
}

export type { PlaceCardProps };
