import type { PlaceDataType } from '@/domains/places/types/place.types';
import type { RoutieType } from '@/domains/routie/types/routie.types';

interface RoutiePlaceItemProps {
  routie: RoutieType;
  place: PlaceDataType;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (placeId: number) => void;
  getDragProps: (index: number) => {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnter: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
  };
}

export type { RoutiePlaceItemProps };
