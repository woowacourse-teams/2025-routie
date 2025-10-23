import type { PlaceWithLikeType } from '@/domains/places/types/place.types';

interface PlaceCardProps extends PlaceWithLikeType {
  selected: boolean;
  liked: boolean;
  isEditing?: boolean;
  onSelect: (placeId: number, selected: boolean) => Promise<void>;
  onDelete: (placeId: number) => Promise<void>;
  onLike: (placeId: number) => void | Promise<void>;
  onEdit: (placeId: number) => void | Promise<void>;
  onCancelEdit?: () => void;
  onUpdateHashtags?: (hashtags: string[]) => Promise<void>;
  onDeleteRoutie: (placeId: number) => Promise<void>;
}

export type { PlaceCardProps };
