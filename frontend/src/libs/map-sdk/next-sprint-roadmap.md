# 다음 스프린트 로드맵

이번 브랜치에서 “마커 라이브러리화” 완료 이후 수행할 작업만 정리한다.

## 1. 폴리라인 라이브러리화

### 목표
- 폴리라인 생성/업데이트/삭제를 `src/libs/map-sdk`로 이동한다.

### 필요한 선행 조건
- MarkerLayer가 libs에 안착해 `window.kakao` 접근 경계가 확정됨
- Map 인스턴스 접근 API(`useMap` 또는 map prop)가 libs에서 제공됨

### 예상 파일/모듈 구조
- `src/libs/map-sdk/components/PolylineLayer/PolylineLayer.tsx`
- `src/libs/map-sdk/types/polyline.types.ts`
- `src/libs/map-sdk/utils/createPolylineOptions.ts`
- `src/domains/maps/hooks/usePolylineRenderer.ts`는 데이터 준비만 담당

### 위험 요소
- 경로 갱신 시 기존 폴리라인 cleanup 누락
- 렌더링 타이밍과 `fitBounds` 타이밍 충돌

## 2. 오버레이/지도 이벤트 모듈화

### 목표
- 오버레이 생성과 이벤트 등록/해제를 libs로 이동한다.

### 필요한 선행 조건
- MarkerLayer/PolylineLayer가 libs 구조에 정착
- Map 이벤트 등록 패턴이 libs에서 재사용 가능해야 함

### 예상 파일/모듈 구조
- `src/libs/map-sdk/components/OverlayLayer/OverlayLayer.tsx`
- `src/libs/map-sdk/components/MapEventLayer/MapEventLayer.tsx`
- `src/libs/map-sdk/types/overlay.types.ts`
- `src/domains/maps/hooks/useCustomOverlay.ts`는 상태만 담당

### 위험 요소
- 클릭 이벤트 중복 등록으로 오버레이 중복 생성
- cleanup 누락으로 메모리/DOM 누수 발생

## 3. mapRef 패턴 제거

### 목표
- 도메인 훅에서 `mapRef`를 제거하고 `useMap` 기반으로 통일한다.

### 필요한 선행 조건
- Marker/Polyline/Overlay 이벤트가 libs 레이어에서 처리됨
- `KakaoMap` 내부가 feature 컴포넌트 기반으로만 구성됨

### 예상 파일/모듈 구조
- `src/domains/maps/hooks/useMapRenderer.ts` 단순화
- `src/domains/maps/hooks/useMapNavigation.ts`는 `useMap` 기반으로 변경
- `src/domains/maps/components/KakaoMap/KakaoMap.tsx`에서 ref 제거

### 위험 요소
- 기존 `mapRef` 기반 훅과 혼용 시 동작 불일치
- 렌더링 순서 변경으로 relayout 타이밍 누락
