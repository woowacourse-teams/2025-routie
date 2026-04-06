import { useEffect } from 'react';

import { useMap } from '../../hooks/useMap';

import type { MapEventLayerProps } from './MapEventLayer.types';

interface MapEventEntry {
  event: 'click' | 'dragend' | 'zoom_changed';
  handler: MapEventLayerProps[keyof MapEventLayerProps];
}

const MapEventLayer = ({ onClick, onDragEnd, onZoomChanged }: MapEventLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const entries: MapEventEntry[] = [
      { event: 'click', handler: onClick },
      { event: 'dragend', handler: onDragEnd },
      { event: 'zoom_changed', handler: onZoomChanged },
    ];

    const activeEntries = entries.filter(
      (entry): entry is MapEventEntry & { handler: () => void } =>
        typeof entry.handler === 'function',
    );

    activeEntries.forEach((entry) => {
      window.kakao.maps.event.addListener(map, entry.event, entry.handler);
    });

    return () => {
      activeEntries.forEach((entry) => {
        window.kakao.maps.event.removeListener(map, entry.event, entry.handler);
      });
    };
  }, [map, onClick, onDragEnd, onZoomChanged]);

  return null;
};

export default MapEventLayer;
