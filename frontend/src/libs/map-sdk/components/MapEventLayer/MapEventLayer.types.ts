type MapEventHandlerType = () => void;

interface MapEventLayerProps {
  onClick?: MapEventHandlerType;
  onDragEnd?: MapEventHandlerType;
  onZoomChanged?: MapEventHandlerType;
}

export type { MapEventHandlerType, MapEventLayerProps };
