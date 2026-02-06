import type { ReactNode } from 'react';

import type { LatLngLiteral } from './adapter.types';

interface OverlayItemType {
  id: string | number;
  position: LatLngLiteral;
  content: ReactNode;
  xAnchor?: number;
  yAnchor?: number;
  zIndex?: number;
  clickable?: boolean;
}

type OverlayItemListType = OverlayItemType[];

export type { OverlayItemType, OverlayItemListType };
