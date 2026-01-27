# 마커 기능 라이브러리화 단계별 계획

## 0. 기본 원칙
- `window.kakao` 접근은 `src/libs/map-sdk` 내부에만 둔다.
- 도메인(`src/domains/maps`)은 마커 입력 데이터와 콜백만 제공한다.
- 변경은 “작동 유지”를 전제로 단계적으로 진행한다.

## 1. 제안하는 libs 구조
현재 구조를 유지하면서, 아래 하위 구조를 추가한다.

```
src/libs/map-sdk/
  components/
    MarkerLayer/
  hooks/
  types/
  utils/
```

## 2. 최소 API 정의 (초기 버전)
- 컴포넌트: `MarkerLayer`
- 입력: `markerItems: MarkerItemType[]`
- 콜백: `onMarkerClick?: (place: PlaceDataType) => void`
- 의존: `useMap()`으로 Map 인스턴스 접근

## 3. 단계별 계획 (커밋 단위)

### 단계 1-1: map-sdk 컴포넌트 폴더 준비
- 목표: libs 내 마커 컴포넌트 추가 위치를 확보한다.
- 변경 파일 목록(예상)
  - `src/libs/map-sdk/components/.gitkeep`
- 작업 상세(체크리스트)
  - [ ] `components` 폴더 생성
  - [ ] 빈 파일로 디렉터리 추적
- 로컬 확인 방법
  - `ls src/libs/map-sdk/components`
- 커밋 메시지 예시
  - map sdk 컴포넌트 폴더 추가

### 단계 1-2: Map 컨텍스트를 libs로 이동
- 목표: libs 컴포넌트가 Map 인스턴스에 접근할 수 있게 한다.
- 변경 파일 목록(예상)
  - `src/libs/map-sdk/contexts/KakaoMapContext.ts`
  - `src/libs/map-sdk/hooks/useMap.ts`
  - `src/domains/maps/contexts/KakaoMapContext.ts`
  - `src/domains/maps/hooks/useMap.ts`
- 작업 상세(체크리스트)
  - [ ] `KakaoMapContext`를 libs로 이동
  - [ ] `useMap`을 libs에서 제공
  - [ ] 도메인 파일은 libs re-export로 변경
- 로컬 확인 방법
  - `npm run lint`
- 커밋 메시지 예시
  - map sdk context libs로 이동

### 단계 1-3: Map 컴포넌트를 libs로 이동
- 목표: Map 생성과 Context 제공을 libs로 고정한다.
- 변경 파일 목록(예상)
  - `src/libs/map-sdk/components/Map/Map.tsx`
  - `src/libs/map-sdk/components/Map/Map.types.ts`
  - `src/domains/maps/components/Map/Map.tsx`
  - `src/domains/maps/components/Map/Map.types.ts`
- 작업 상세(체크리스트)
  - [ ] Map 컴포넌트를 libs로 이동
  - [ ] 도메인 Map 컴포넌트는 re-export만 유지
  - [ ] 기존 import 경로 변경 없음 확인
- 로컬 확인 방법
  - `npm run lint`
- 커밋 메시지 예시
  - map 컴포넌트 libs로 이동

### 단계 2-1: 마커 타입 추가
- 목표: 도메인과 공유할 최소 타입을 libs에 정의한다.
- 변경 파일 목록(예상)
  - `src/libs/map-sdk/types/marker.types.ts`
  - `src/libs/map-sdk/index.ts`
- 작업 상세(체크리스트)
  - [ ] `MarkerItemType` 정의
  - [ ] `MarkerClickHandlerType` 정의
  - [ ] libs public export에 추가
- 로컬 확인 방법
  - `npm run lint`
- 커밋 메시지 예시
  - map sdk 마커 타입 추가

### 단계 2-2: 커스텀 마커 DOM 유틸 이동
- 목표: 마커 DOM 생성 책임을 libs로 이동한다.
- 변경 파일 목록(예상)
  - `src/libs/map-sdk/utils/createCustomMarkerElement.ts`
  - `src/domains/maps/utils/createCustomMarkerElement.ts`
- 작업 상세(체크리스트)
  - [ ] 유틸을 libs로 이동
  - [ ] 도메인은 libs 유틸 re-export로 변경
- 로컬 확인 방법
  - `npm run lint`
- 커밋 메시지 예시
  - 마커 DOM 유틸 libs로 이동

### 단계 3-1: MarkerLayer 컴포넌트 스켈레톤 추가
- 목표: 마커 렌더링 전용 컴포넌트를 libs에 추가한다.
- 변경 파일 목록(예상)
  - `src/libs/map-sdk/components/MarkerLayer/MarkerLayer.tsx`
  - `src/libs/map-sdk/components/MarkerLayer/MarkerLayer.types.ts`
  - `src/libs/map-sdk/index.ts`
- 작업 상세(체크리스트)
  - [ ] `markerItems` props 정의
  - [ ] `onMarkerClick` props 정의
  - [ ] `useMap()`으로 map 인스턴스 접근
- 로컬 확인 방법
  - `npm run lint`
- 커밋 메시지 예시
  - map sdk 마커 레이어 스켈레톤 추가

### 단계 3-2: MarkerLayer에 실제 렌더링 연결
- 목표: MarkerLayer가 `window.kakao`를 사용해 마커를 그리게 한다.
- 변경 파일 목록(예상)
  - `src/libs/map-sdk/components/MarkerLayer/MarkerLayer.tsx`
- 작업 상세(체크리스트)
  - [ ] Marker/CustomOverlay 생성 로직 추가
  - [ ] 이벤트 등록/해제 로직 추가
  - [ ] cleanup 시 마커 제거
- 로컬 확인 방법
  - `npm run start`
  - RoutieSpace에서 마커 표시 확인
- 커밋 메시지 예시
  - map sdk 마커 렌더링 구현

### 단계 4-1: 도메인에 markerItems 생성 훅 추가
- 목표: 도메인은 마커 입력 데이터만 생성하도록 한다.
- 변경 파일 목록(예상)
  - `src/domains/maps/hooks/useMarkerRenderer.ts`
  - `src/domains/maps/types/map.types.ts`
- 작업 상세(체크리스트)
  - [ ] 마커 리스트를 `MarkerItemType[]`로 변환
  - [ ] 필터링/정렬 로직은 도메인에 유지
  - [ ] 기존 렌더링 훅은 유지
- 로컬 확인 방법
  - `npm run lint`
- 커밋 메시지 예시
  - 마커 데이터 변환 훅 추가

### 단계 4-2: KakaoMap에 MarkerLayer 연결
- 목표: 실제 렌더링 책임을 libs로 옮긴다.
- 변경 파일 목록(예상)
  - `src/domains/maps/components/KakaoMap/KakaoMap.tsx`
- 작업 상세(체크리스트)
  - [ ] `MarkerLayer` 컴포넌트 추가
  - [ ] `markerItems`와 클릭 콜백 연결
  - [ ] 기존 렌더링 흐름 유지
- 로컬 확인 방법
  - `npm run start`
  - RoutieSpace에서 마커 클릭 동작 확인
- 커밋 메시지 예시
  - KakaoMap에 마커 레이어 연결

### 단계 5-1: 도메인 마커 렌더링 로직 제거
- 목표: 도메인에서 SDK 접근을 제거한다.
- 변경 파일 목록(예상)
  - `src/domains/maps/hooks/useMapMarkerControl.ts`
  - `src/domains/maps/hooks/useMapRenderer.ts`
  - `src/domains/maps/types/api.types.ts`
- 작업 상세(체크리스트)
  - [ ] 마커 생성/삭제 코드 제거
  - [ ] 남은 네비게이션 유틸만 유지
  - [ ] 불필요 타입 정리
- 로컬 확인 방법
  - `npm run lint`
- 커밋 메시지 예시
  - 도메인 마커 렌더링 제거
