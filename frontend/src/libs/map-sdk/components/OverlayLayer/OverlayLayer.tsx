import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { kakaoMapAdapter } from '../../adapters/kakaoMapAdapter';
import { useMap } from '../../hooks/useMap';

import type { OverlayLayerProps } from './OverlayLayer.types';
import type { CustomOverlayInstanceType, LatLngLiteral } from '../../types/adapter.types';
import type { OverlayItemType } from '../../types/overlay.types';

const getPositionKey = (position: LatLngLiteral) =>
  `${position.lat},${position.lng}`;

const getOptionsKey = (item: OverlayItemType) =>
  `${item.xAnchor ?? 0.5}-${item.yAnchor ?? 0.5}-${item.zIndex ?? 'none'}-${
    item.clickable ?? 'none'
  }`;

const OverlayLayer = ({ overlayItem }: OverlayLayerProps) => {
  const map = useMap();
  const overlayRef = useRef<CustomOverlayInstanceType | null>(null);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const prevOptionsKeyRef = useRef<string | null>(null);
  const prevPositionKeyRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (overlayRef.current) {
        kakaoMapAdapter.removeCustomOverlay(overlayRef.current);
        overlayRef.current = null;
      }
      setContainerEl(null);
      prevOptionsKeyRef.current = null;
      prevPositionKeyRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (!map || !overlayItem) {
      if (overlayRef.current) {
        kakaoMapAdapter.removeCustomOverlay(overlayRef.current);
        overlayRef.current = null;
      }
      setContainerEl(null);
      prevOptionsKeyRef.current = null;
      prevPositionKeyRef.current = null;
      return;
    }

    const positionKey = getPositionKey(overlayItem.position);
    const optionsKey = getOptionsKey(overlayItem);

    if (!overlayRef.current) {
      const container = document.createElement('div');
      container.style.pointerEvents =
        overlayItem.clickable === false ? 'none' : 'auto';
      setContainerEl(container);

      overlayRef.current = kakaoMapAdapter.createCustomOverlay(map, {
        position: overlayItem.position,
        content: container,
        xAnchor: overlayItem.xAnchor,
        yAnchor: overlayItem.yAnchor,
        zIndex: overlayItem.zIndex,
        clickable: overlayItem.clickable,
      });

      prevOptionsKeyRef.current = optionsKey;
      prevPositionKeyRef.current = positionKey;
      return;
    }

    if (prevOptionsKeyRef.current !== optionsKey && containerEl) {
      kakaoMapAdapter.removeCustomOverlay(overlayRef.current);

      containerEl.style.pointerEvents =
        overlayItem.clickable === false ? 'none' : 'auto';

      overlayRef.current = kakaoMapAdapter.createCustomOverlay(map, {
        position: overlayItem.position,
        content: containerEl,
        xAnchor: overlayItem.xAnchor,
        yAnchor: overlayItem.yAnchor,
        zIndex: overlayItem.zIndex,
        clickable: overlayItem.clickable,
      });

      prevOptionsKeyRef.current = optionsKey;
      prevPositionKeyRef.current = positionKey;
      return;
    }

    if (prevPositionKeyRef.current !== positionKey && overlayRef.current) {
      kakaoMapAdapter.setCustomOverlayPosition(
        overlayRef.current,
        overlayItem.position,
      );
      prevPositionKeyRef.current = positionKey;
    }
  }, [map, overlayItem, containerEl]);

  const overlayContent = useMemo(() => overlayItem?.content ?? null, [overlayItem]);

  return (
    <>
      {overlayContent && containerEl
        ? createPortal(overlayContent, containerEl)
        : null}
    </>
  );
};

export default OverlayLayer;
