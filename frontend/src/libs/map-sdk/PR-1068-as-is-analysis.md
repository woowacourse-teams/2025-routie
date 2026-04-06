# PR 1068 As-Is 분석

## 1. 현재 구조의 설계 의도 요약
- `src/libs/map-sdk`는 SDK 로딩과 기본 제어를 전역 싱글톤으로 고정하고, UI에서 직접 로딩을 다루지 않도록 설계됐다.
- `src/domains/maps`는 Map 컴포넌트와 도메인 UI를 담당하고, SDK 로딩 상태는 `KakaoMapLoadBoundary`에서 흡수한다.
- Adapter 패턴을 통해 SDK 교체 가능성을 열어두되, 실제 지도 렌더링은 도메인 레이어에 남아 있다.

## 2. SDK 로딩 책임
- 로딩 진입: `src/index.tsx`에서 `mapSdkLoader.init` 단일 호출
- 로딩 상태 관리: `src/libs/map-sdk/core/MapSdkLoader.ts`
- SDK 삽입/초기화: `src/libs/map-sdk/adapters/kakaoMapAdapter.ts`
- UI 경계: `src/domains/maps/components/KakaoMapLoadBoundary/KakaoMapLoadBoundary.tsx`

의도:
- 로딩 정책은 앱 진입 시 1회 결정하고, 화면에서는 로딩 상태만 구독한다.
- 다른 지도 SDK로 전환 시 `kakaoMapAdapter`만 교체하도록 구조를 고정한다.

## 3. Map 인스턴스 생성/생명주기
- 생성 위치: `src/libs/map-sdk/components/Map/Map.tsx`
- 생성 API: `mapController.createMap` → adapter 경유
- 수명주기: Map 컴포넌트 mount 시 생성, unmount 시 DOM 제거에 의존
- 상태 동기화: `center/level/draggable/scrollwheel`을 `useEffect`로 동기화

의도:
- 인스턴스 생성은 Map 컴포넌트에서만 수행하고, 자식은 `useMap()`으로 접근한다.
- Map의 prop 변경을 React 생명주기와 연결해 선언적으로 제어한다.

## 4. 도메인 의존 구조
- 마커/폴리라인/오버레이 구현은 `src/domains/maps/hooks`에 분산돼 있다.
- `window.kakao` 접근이 훅/유틸에 직접 존재한다.
- 도메인 UI(`KakaoMap`)가 렌더링 흐름을 조합하고, 일부 이벤트 등록도 담당한다.

의도:
- 도메인 UI에서 지도 기능을 조합하되, 로딩/생성은 공통 모듈로 분리하려는 방향.
- 하지만 SDK 직접 접근이 도메인에 남아 있어 라이브러리 경계가 완전히 닫히지 않았다.

## 5. 마커 라이브러리화를 위한 의존성 지도

### 현재 마커 의존성 흐름
1. 데이터 준비
   - `usePlaceList` + `useRoutePlacesWithDetails` + `filterPlacesByHashtags`
2. 마커 생성/삭제
   - `useMapMarkerControl`에서 `window.kakao.maps.Marker/CustomOverlay` 직접 호출
3. 렌더링 트리거
   - `useMapRenderer`가 마커/폴리라인 렌더링을 호출
4. 클릭 후 도메인 상태 연동
   - `useClickedPlace`가 선택 상태/오버레이 열기 담당
   - `useMapNavigation`이 pan/fit 제어

### 라이브러리화 전제 조건
- `window.kakao` 접근을 `src/libs/map-sdk`로 이동해야 한다.
- 마커 입력 데이터 타입을 libs로 이동하고, 도메인은 리스트만 생성해야 한다.
- Map 인스턴스는 libs 컴포넌트/훅에서 접근 가능해야 한다.
  - 선택지 A: `Map`/`useMap`를 libs로 이동
  - 선택지 B: marker 컴포넌트가 `map` 인스턴스를 props로 받도록 설계
- 도메인 훅은 “데이터 준비/선택 상태”만 남기고, 렌더링 책임은 libs로 이전한다.
