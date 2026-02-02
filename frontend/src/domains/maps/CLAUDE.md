# Maps 도메인 가이드

Kakao Maps SDK를 React 방식으로 래핑한 모듈.

## 핵심 아키텍처

### SDK 로딩 (싱글톤 패턴)

```
src/libs/map-sdk/core/MapSdkLoader.ts
```

- **싱글톤 패턴**: `mapSdkLoader.getInstance()`로 단일 인스턴스 사용
- **Adapter 패턴**: `kakaoMapAdapter`를 통한 벤더 추상화
- **useSyncExternalStore 호환**: React 18+ 동시성 지원

```typescript
// src/index.tsx에서 앱 시작 시 1회 호출
mapSdkLoader.init({ appkey: process.env.REACT_APP_KAKAO_MAP_APPKEY || '' });
```

### 타입 정의

```
kakao.d.ts                             - Kakao SDK 전체 타입 (KakaoMap, KakaoMarker 등)
src/libs/map-sdk/types/adapter.types.ts - Adapter 인터페이스 타입
src/domains/maps/types/api.types.ts    - API 관련 타입
```

### 훅

| 훅 | 용도 |
|---|---|
| `useKakaoLoader` | SDK 로딩 상태 (status, error, load) |
| `useMap` | Context에서 map 인스턴스 획득 |
| `useMapNavigationControl` | 지도 이동 제어 |

### 컴포넌트

| 컴포넌트 | 용도 |
|---|---|
| `KakaoMapLoadBoundary` | SDK 로딩 + 로딩/에러 UI 처리 |
| `Map` | 선언적 지도 렌더링 (Context Provider 포함) |
| `KakaoMap` | 메인 지도 컴포넌트 |

## 사용 예시

### 기본 사용 (KakaoMap 컴포넌트)

```tsx
import KakaoMap from '@/domains/maps/components/KakaoMap/KakaoMap';

<KakaoMap isSidebarOpen={isSidebarOpen} />
```

### 새로운 Map 컴포넌트 사용

```tsx
import KakaoMapLoadBoundary from '@/domains/maps/components/KakaoMapLoadBoundary/KakaoMapLoadBoundary';
import { Map } from '@/libs/map-sdk';

<KakaoMapLoadBoundary
  fallback={<div>로딩 중...</div>}
  errorFallback={(error) => <div>에러: {error.message}</div>}
>
  <Map
    center={{ lat: 37.554, lng: 126.97 }}
    level={7}
    onMapReady={(map) => console.log('Map ready:', map)}
    onClick={() => console.log('Map clicked')}
  >
    {/* 자식 컴포넌트에서 useMap()으로 map 인스턴스 접근 가능 */}
  </Map>
</KakaoMapLoadBoundary>
```

### useMap 훅으로 map 인스턴스 접근

```tsx
import { useMap } from '@/libs/map-sdk';

const MyComponent = () => {
  const map = useMap(); // Map 컴포넌트 내부에서만 사용 가능

  const handleCenter = () => {
    if (map) {
      map.setCenter(new window.kakao.maps.LatLng(37.5, 127.0));
    }
  };

  return <button onClick={handleCenter}>중심 이동</button>;
};
```

## 파일 구조

```
src/
├── libs/map-sdk/
│   ├── adapters/kakaoMapAdapter.ts  # 카카오 SDK Adapter
│   ├── core/MapSdkLoader.ts         # SDK 로더 싱글톤
│   ├── controllers/mapController.ts # 지도 제어 함수
│   ├── hooks/useMapSdkLoader.ts     # SDK 로딩 훅
│   ├── types/adapter.types.ts       # 타입 정의
│   └── index.ts                     # Public API
└── domains/maps/
    ├── contexts/
    │   └── KakaoMapContext.ts       # Map Context + useMap
    ├── hooks/
    │   ├── useKakaoLoader.ts        # SDK 로딩 상태 훅
    │   ├── useMap.ts                # useMap re-export
    │   └── useMapNavigationControl.ts   # 지도 이동 제어
    ├── components/
    │   ├── KakaoMapLoadBoundary/    # SDK 로딩 래퍼
    │   ├── Map/                     # 선언적 지도 컴포넌트
    │   └── KakaoMap/                # 메인 지도
    └── types/
        └── api.types.ts
```

## 주의사항

1. **init() 필수**: `mapSdkLoader.init()`은 앱 시작 시 `src/index.tsx`에서 1회만 호출
2. **Context 범위**: `useMap()`은 `Map` 컴포넌트 내부에서만 사용 가능
3. **SDK 로딩 완료 후 사용**: `status === 'loaded'` 확인 후 `window.kakao.maps` 사용
4. **Import 규칙**: map-sdk 경로는 `@/libs/map-sdk` alias를 사용
