import { RefObject, useCallback, useRef, useState } from 'react';

import type { KakaoMapType } from '../types/KaKaoMap.types';
import type { CustomOverlayType } from '../types/Overlay.types';

const useCustomOverlay = ({ map }: { map: RefObject<KakaoMapType> }) => {
  const overlayRef = useRef<CustomOverlayType | null>(null);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  const openAt = useCallback(
    (lat: number, lng: number) => {
      if (!map.current) return;

      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }

      const container = document.createElement('div');
      container.style.pointerEvents = 'auto';
      setContainerEl(container);

      overlayRef.current = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(lat, lng),
        yAnchor: 1,
        xAnchor: 0.5,
        zIndex: 3000,
        content: container,
        map: map.current,
        clickable: true,
      });
    },
    [map],
  );

  const close = useCallback(() => {
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }
    setContainerEl(null);
  }, []);

  return { openAt, close, containerEl };
};

export { useCustomOverlay };
