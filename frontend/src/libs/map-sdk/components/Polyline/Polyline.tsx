import { useEffect, useMemo, useRef } from 'react';

import { kakaoMapAdapter } from '../../adapters/kakaoMapAdapter';
import { useMap } from '../../hooks/useMap';

import type { PolylineProps } from './Polyline.types';
import type { PolylineInstanceType } from '../../types/adapter.types';

const Polyline = ({
  path,
  strokeColor = '#F10000',
  strokeWeight = 3,
  strokeOpacity = 0.6,
  strokeStyle = 'solid',
  zIndex,
}: PolylineProps) => {
  const map = useMap();
  const polylineRef = useRef<PolylineInstanceType | null>(null);
  const prevPathKeyRef = useRef<string | null>(null);
  const prevStyleRef = useRef<string | null>(null);

  // path를 문자열로 직렬화하여 의존성 비교
  const pathKey = useMemo(
    () => path.map((p) => `${p.lat},${p.lng}`).join('|'),
    [path],
  );

  // style을 문자열로 직렬화하여 의존성 비교
  const styleKey = useMemo(
    () => `${strokeColor}-${strokeWeight}-${strokeOpacity}-${strokeStyle}-${zIndex}`,
    [strokeColor, strokeWeight, strokeOpacity, strokeStyle, zIndex],
  );

  const isValidPath = path.length >= 2;

  // 인스턴스 생성/제거
  useEffect(() => {
    if (!map || !isValidPath) {
      if (polylineRef.current) {
        kakaoMapAdapter.removePolyline(polylineRef.current);
        polylineRef.current = null;
        prevPathKeyRef.current = null;
        prevStyleRef.current = null;
      }
      return;
    }

    if (polylineRef.current) return;

    const polyline = kakaoMapAdapter.createPolyline(map, {
      path,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      strokeStyle,
      zIndex,
    });
    polylineRef.current = polyline;
    prevPathKeyRef.current = pathKey;
    prevStyleRef.current = styleKey;

    return () => {
      if (polylineRef.current) {
        kakaoMapAdapter.removePolyline(polylineRef.current);
        polylineRef.current = null;
        prevPathKeyRef.current = null;
        prevStyleRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isValidPath]);

  // path 변경 시 업데이트
  useEffect(() => {
    if (!polylineRef.current || !isValidPath) return;
    if (prevPathKeyRef.current === pathKey) return;
    if (prevPathKeyRef.current === null) {
      prevPathKeyRef.current = pathKey;
      return;
    }
    prevPathKeyRef.current = pathKey;
    kakaoMapAdapter.setPolylinePath(polylineRef.current, path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey, isValidPath]);

  // 스타일 옵션 변경 시 업데이트
  useEffect(() => {
    if (!polylineRef.current) return;
    if (prevStyleRef.current === styleKey) return;
    if (prevStyleRef.current === null) {
      prevStyleRef.current = styleKey;
      return;
    }
    prevStyleRef.current = styleKey;
    kakaoMapAdapter.setPolylineOptions(polylineRef.current, {
      strokeColor,
      strokeWeight,
      strokeOpacity,
      strokeStyle,
      zIndex,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleKey]);

  return null;
};

export default Polyline;
