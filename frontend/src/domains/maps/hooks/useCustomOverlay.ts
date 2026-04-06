import { useCallback, useState } from 'react';

import type { UseCustomOverlayReturn } from '@/domains/maps/types/map.types';

const useCustomOverlay = (): UseCustomOverlayReturn => {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const openAt = useCallback((lat: number, lng: number) => {
    const container = document.createElement('div');
    container.style.pointerEvents = 'auto';
    setContainerEl(container);
    setPosition({ lat, lng });
  }, []);

  const close = useCallback(() => {
    setContainerEl(null);
    setPosition(null);
  }, []);

  return { openAt, close, containerEl, position };
};

export { useCustomOverlay };
