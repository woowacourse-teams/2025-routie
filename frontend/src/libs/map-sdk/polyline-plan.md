# Polyline 컴포넌트 추상화 계획

## 요약

기존 명령형 `usePolyline` 훅을 map-sdk의 선언적 `Polyline` 컴포넌트로 전환합니다. react-kakao-maps-sdk를 참고하되, 현재 프로젝트의 Adapter 패턴과 컨벤션에 맞게 구현합니다.

**설계 결정**: 마커는 N개이므로 MarkerEngine으로 중앙 관리하지만, 폴리라인은 보통 1개만 사용하므로 Engine 없이 **단순 선언적 컴포넌트**로 구현합니다.

---

## 파일 구조

```
src/libs/map-sdk/
├── types/adapter.types.ts           # Polyline 타입 추가
├── adapters/kakaoMapAdapter.ts      # Polyline 메서드 추가
├── components/
│   └── Polyline/
│       ├── Polyline.tsx             # 선언적 컴포넌트 (신규)
│       └── Polyline.types.ts        # Props 타입 (신규)
└── index.ts                         # export 추가

src/domains/maps/
├── components/
│   └── PolylineLayer/
│       └── PolylineLayer.tsx        # 도메인 레이어 연결 (신규)
└── hooks/
    ├── usePolyline.ts               # 삭제 예정
    └── usePolylineRenderer.ts       # 삭제 예정
```

---

## 구현 진행 상황

### Phase 1: 타입 및 어댑터 확장
- [x] 1-1. adapter.types.ts에 Polyline 타입 추가
- [x] 1-2. MapAdapter 인터페이스에 메서드 4개 추가
- [x] 1-3. kakaoMapAdapter에 구현 추가

### Phase 2: Polyline 컴포넌트 구현
- [x] 2-1. Polyline.types.ts 생성
- [x] 2-2. Polyline.tsx 구현
- [x] 2-3. index.ts에 export 추가

### Phase 3: 도메인 레이어 마이그레이션
- [x] 3-1. PolylineLayer 컴포넌트 생성
- [x] 3-2. KakaoMap에서 PolylineLayer 사용
- [x] 3-3. 기존 usePolyline.ts 삭제
- [x] 3-4. 기존 usePolylineRenderer.ts 삭제
- [x] 3-5. useMapRenderer.ts에서 polyline 관련 코드 제거

### Phase 4: 테스트 작성
- [x] 4-1. Polyline.test.tsx 작성

### Phase 5: 검증
- [x] 5-1. npm run lint 실행
- [x] 5-2. npm run test:run 실행
- [ ] 5-3. 개발 서버에서 렌더링 확인
- [ ] 5-4. SSE 동기화 테스트

---

## 세부 구현 내용

### Phase 1: 타입 및 어댑터 확장

**1-1. adapter.types.ts에 추가할 타입**

```typescript
// kakao.d.ts에서 import
import type { KakaoPolyline } from '../../../../kakao.d';

type PolylineInstanceType = KakaoPolyline;

type StrokeStyle =
  | 'solid' | 'shortdash' | 'shortdot' | 'shortdashdot' | 'shortdashdotdot'
  | 'dot' | 'dash' | 'dashdot' | 'longdash' | 'longdashdot' | 'longdashdotdot';

interface PolylineCreateOptions {
  path: LatLngLiteral[];
  strokeColor?: string;      // default '#F10000'
  strokeWeight?: number;     // default 3
  strokeOpacity?: number;    // default 0.6
  strokeStyle?: StrokeStyle; // default 'solid'
  zIndex?: number;
}
```

**1-2. MapAdapter 인터페이스에 추가** (4개 메서드만)

```typescript
createPolyline(map: MapInstanceType, options: PolylineCreateOptions): PolylineInstanceType;
removePolyline(polyline: PolylineInstanceType): void;
setPolylinePath(polyline: PolylineInstanceType, path: LatLngLiteral[]): void;
setPolylineOptions(polyline: PolylineInstanceType, options: Partial<PolylineCreateOptions>): void;
```

**1-3. kakaoMapAdapter 구현**

```typescript
createPolyline(map, options) {
  const path = options.path.map((p) => this.createLatLng(p.lat, p.lng));
  const polyline = new window.kakao.maps.Polyline({
    map,
    path,
    strokeColor: options.strokeColor ?? '#F10000',
    strokeWeight: options.strokeWeight ?? 3,
    strokeOpacity: options.strokeOpacity ?? 0.6,
    strokeStyle: options.strokeStyle ?? 'solid',
    zIndex: options.zIndex,
  });
  return polyline;
}

removePolyline(polyline) {
  polyline.setMap(null);
}

setPolylinePath(polyline, path) {
  const kakaoPath = path.map((p) => this.createLatLng(p.lat, p.lng));
  polyline.setPath(kakaoPath);
}

setPolylineOptions(polyline, options) {
  // 스타일 옵션을 개별 메서드로 적용
  if (options.strokeColor !== undefined) {
    polyline.setStrokeColor(options.strokeColor);
  }
  if (options.strokeWeight !== undefined) {
    polyline.setStrokeWeight(options.strokeWeight);
  }
  if (options.strokeOpacity !== undefined) {
    polyline.setStrokeOpacity(options.strokeOpacity);
  }
  if (options.strokeStyle !== undefined) {
    polyline.setStrokeStyle(options.strokeStyle);
  }
  if (options.zIndex !== undefined) {
    polyline.setZIndex(options.zIndex);
  }
}
```

---

### Phase 2: Polyline 컴포넌트 구현

**2-1. Polyline.types.ts** (viewOnly - 이벤트 핸들러 제거)

```typescript
interface PolylineProps {
  path: LatLngLiteral[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  strokeStyle?: StrokeStyle;
  zIndex?: number;
}
```

**2-2. Polyline.tsx 핵심 로직** (이전 값 비교로 중복 호출 방지)

```typescript
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
  const prevPathKeyRef = useRef<string | null>(null);  // 이전 path 값
  const prevStyleRef = useRef<string | null>(null);    // 이전 style 값

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
        prevPathKeyRef.current = null;  // 인스턴스 제거 시 리셋
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
    prevPathKeyRef.current = pathKey;   // 생성 시 초기값 저장
    prevStyleRef.current = styleKey;

    return () => {
      if (polylineRef.current) {
        kakaoMapAdapter.removePolyline(polylineRef.current);
        polylineRef.current = null;
        prevPathKeyRef.current = null;
        prevStyleRef.current = null;
      }
    };
  }, [map, isValidPath]);

  // path 변경 시 업데이트
  // Note: path는 pathKey에서 파생되므로 의존성에서 제외 (ESLint 경고 무시)
  useEffect(() => {
    if (!polylineRef.current || !isValidPath) return;
    if (prevPathKeyRef.current === pathKey) return;     // 같으면 스킵
    if (prevPathKeyRef.current === null) {              // 최초 실행 스킵
      prevPathKeyRef.current = pathKey;
      return;
    }
    prevPathKeyRef.current = pathKey;
    kakaoMapAdapter.setPolylinePath(polylineRef.current, path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey, isValidPath]);

  // 스타일 옵션 변경 시 업데이트
  // Note: 개별 스타일 값들은 styleKey에서 파생되므로 의존성에서 제외 (ESLint 경고 무시)
  useEffect(() => {
    if (!polylineRef.current) return;
    if (prevStyleRef.current === styleKey) return;      // 같으면 스킵
    if (prevStyleRef.current === null) {                // 최초 실행 스킵
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
```

---

### Phase 3: 도메인 레이어 마이그레이션

**3-1. PolylineLayer 컴포넌트 생성** (스타일 props로 전달)

```tsx
// src/domains/maps/components/PolylineLayer/PolylineLayer.tsx
import { Polyline } from '@/libs/map-sdk';
import { useRoutePlacesWithDetails } from '@/domains/maps/hooks/useRoutePlacesWithDetails';
import type { PolylineLayerProps } from './PolylineLayer.types';

interface PolylineLayerProps {
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

const PolylineLayer = ({
  strokeColor = '#3B82F6',
  strokeWeight = 4,
  strokeOpacity = 0.8,
}: PolylineLayerProps) => {
  const { routiePlacesWithDetails } = useRoutePlacesWithDetails();

  const path = routiePlacesWithDetails.map((place) => ({
    lat: place.latitude,
    lng: place.longitude,
  }));

  if (path.length < 2) return null;

  return (
    <Polyline
      path={path}
      strokeColor={strokeColor}
      strokeWeight={strokeWeight}
      strokeOpacity={strokeOpacity}
    />
  );
};
```

**3-2. KakaoMap에서 사용**

```tsx
<Map center={center} level={7}>
  <MarkerLayer />
  <PolylineLayer />
</Map>
```

**3-3~3-5. 삭제/수정할 파일**
- `src/domains/maps/hooks/usePolyline.ts` - 삭제
- `src/domains/maps/hooks/usePolylineRenderer.ts` - 삭제
- `src/domains/maps/hooks/useMapRenderer.ts` - polyline 관련 코드 제거

---

### Phase 4: 테스트 작성

**4-1. Polyline.test.tsx 작성**

```typescript
// src/libs/map-sdk/components/Polyline/__tests__/Polyline.test.tsx
describe('Polyline', () => {
  it('map이 준비되면 폴리라인을 생성한다', () => {});
  it('언마운트 시 폴리라인을 제거한다', () => {});
  it('path가 변경되면 setPolylinePath를 호출한다', () => {});
  it('path가 2개 미만이면 폴리라인을 생성하지 않는다', () => {});
  it('스타일 옵션이 변경되면 setPolylineOptions를 호출한다', () => {});
});
```

---

## 수정 대상 파일 목록

| 파일 | 작업 |
|------|------|
| `src/libs/map-sdk/types/adapter.types.ts` | Polyline 타입 추가 |
| `src/libs/map-sdk/adapters/kakaoMapAdapter.ts` | Polyline 메서드 구현 |
| `src/libs/map-sdk/components/Polyline/Polyline.types.ts` | 신규 생성 |
| `src/libs/map-sdk/components/Polyline/Polyline.tsx` | 신규 생성 |
| `src/libs/map-sdk/index.ts` | export 추가 |
| `src/domains/maps/components/PolylineLayer/PolylineLayer.tsx` | 신규 생성 |
| `src/domains/maps/hooks/usePolyline.ts` | 삭제 |
| `src/domains/maps/hooks/usePolylineRenderer.ts` | 삭제 |
| `src/domains/maps/hooks/useMapRenderer.ts` | polyline 관련 제거 |

---

## 고려사항

- **path가 2개 미만일 때**: 폴리라인 인스턴스 생성하지 않음
- **SSE 실시간 업데이트**: `routiePlacesWithDetails` 변경 → PolylineLayer 리렌더링 → path prop 변경 → `setPath` 호출
- **여러 폴리라인 필요 시**: 각각 `<Polyline />` 렌더링으로 대응 가능
