import Marker from '../Marker/Marker';
import NumberMarker from '../NumberMarker/NumberMarker';

import type { MarkerLayerProps } from './MarkerLayer.types';

/**
 * 마커 렌더링 전용 레이어 컴포넌트
 *
 * @description
 * markerItems 배열을 받아 Marker 또는 NumberMarker 컴포넌트를 선언적으로 렌더링합니다.
 * routieSequence가 있으면 NumberMarker, 없으면 Marker를 렌더링합니다.
 * React의 reconciliation을 통해 자동으로 추가/삭제/변경을 처리합니다.
 *
 * @example
 * ```tsx
 * <Map center={{ lat: 37.5, lng: 127.0 }}>
 *   <MarkerLayer
 *     markerItems={items}
 *     onMarkerClick={(place) => console.log(place)}
 *   />
 * </Map>
 * ```
 */
const MarkerLayer = ({ markerItems, onMarkerClick }: MarkerLayerProps) => {
  return (
    <>
      {markerItems.map((item) => {
        const position = {
          lat: item.place.latitude,
          lng: item.place.longitude,
        };

        if (item.routieSequence) {
          return (
            <NumberMarker
              key={`number-${item.place.id}`}
              position={position}
              sequence={item.routieSequence}
              onClick={() => onMarkerClick?.(item.place)}
            />
          );
        }

        return (
          <Marker
            key={item.place.id}
            position={position}
            title={item.place.name}
            onClick={() => onMarkerClick?.(item.place)}
          />
        );
      })}
    </>
  );
};

export default MarkerLayer;
