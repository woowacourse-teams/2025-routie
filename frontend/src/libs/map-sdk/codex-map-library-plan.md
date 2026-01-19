# 카카오 지도 SDK → React 내부 지도 라이브러리 설계 문서

이 문서는 현재 레포지토리의 실제 코드 사용 패턴을 기반으로, 카카오 지도 SDK 사용 코드를 React 친화적 내부 라이브러리로 분리·설계하기 위한 실행 가능한 계획을 제공한다.

---

## 1. As-Is 분석

### A. kakao.maps 직접 사용 위치

- `public/index.html`
  - SDK API: 스크립트 로딩 (`//dapi.kakao.com/v2/maps/sdk.js?autoload=false`)
  - 역할: SDK를 전역에 주입하고 런타임 로딩 전제 형성

- `src/domains/maps/hooks/useKakaoMapSDK.ts`
  - SDK API: `window.kakao.maps.load`
  - 역할: SDK 로딩 상태 관리, 재시도 로직

- `src/domains/maps/hooks/useKakaoMapInit.ts`
  - SDK API: `new window.kakao.maps.Map`, `new window.kakao.maps.LatLng`, `map.relayout`
  - 역할: 지도 생성, 초기 중심/레벨 설정, 초기 relayout 타이밍 제어

- `src/domains/maps/hooks/useMapMarkerControl.ts`
  - SDK API: `new window.kakao.maps.Marker`, `new window.kakao.maps.CustomOverlay`, `new window.kakao.maps.LatLngBounds`, `window.kakao.maps.event.addListener`, `map.setBounds`, `map.panTo`
  - 역할: 마커/오버레이 생성과 클릭 이벤트 연결, bounds/pan 이동

- `src/domains/maps/hooks/useCustomOverlay.ts`
  - SDK API: `new window.kakao.maps.CustomOverlay`, `new window.kakao.maps.LatLng`
  - 역할: 커스텀 오버레이 생성/정리, React Portal 대상 컨테이너 관리

- `src/domains/maps/hooks/usePolyline.ts`
  - SDK API: `new window.kakao.maps.Polyline`, `new window.kakao.maps.LatLng`
  - 역할: 동선(폴리라인) 생성 및 제거

- `src/domains/maps/components/KakaoMap/KakaoMap.tsx`
  - SDK API: `window.kakao.maps.event.addListener/removeListener`
  - 역할: 지도 클릭 이벤트 등록/해제

### B. 책임 분류

- SDK 로딩
  - `src/domains/maps/hooks/useKakaoMapSDK.ts`

- 지도 생성 및 수명주기
  - `src/domains/maps/hooks/useKakaoMapInit.ts`
  - `src/domains/maps/hooks/useMapState.ts` (SDK 로딩/초기화 상태 조합)

- 이벤트 관리
  - 지도 클릭: `src/domains/maps/components/KakaoMap/KakaoMap.tsx`
  - 마커 클릭: `src/domains/maps/hooks/useMapMarkerControl.ts`

- 마커/오버레이
  - 마커/오버레이 생성·삭제: `src/domains/maps/hooks/useMapMarkerControl.ts`
  - 오버레이 컨테이너: `src/domains/maps/hooks/useCustomOverlay.ts`
  - 마커 DOM 생성: `src/domains/maps/utils/createCustomMarkerElement.ts`

- 폴리라인(동선)
  - `src/domains/maps/hooks/usePolyline.ts`
  - 렌더 흐름: `src/domains/maps/hooks/usePolylineRenderer.ts`

- bounds / pan / viewport
  - `src/domains/maps/hooks/useMapMarkerControl.ts`
  - `src/domains/maps/hooks/useMapNavigation.ts`

### C. 문제점 도출 (React 관점 포함)

- 문제 1: SDK 타입이 앱 레이어에 노출됨
  - 실제 상황: `src/domains/maps/types/api.types.ts`, `src/domains/maps/types/map.types.ts`가 `InstanceType<typeof window.kakao.maps.*>`를 직접 사용.
  - 실수/고민 지점: 화면/도메인 코드가 SDK 타입 변경에 영향을 받는다.
  - React 관점 위험: 외부 전역 타입이 컴포넌트 경계를 침범해 선언형 추상화가 무너진다.

- 문제 2: SDK 접근이 훅/컴포넌트에 분산됨
  - 실제 상황: `useKakaoMapInit`, `useMapMarkerControl`, `useCustomOverlay`, `usePolyline`, `KakaoMap.tsx` 등 다수에서 직접 `window.kakao` 접근.
  - 실수/고민 지점: SDK 로딩 타이밍/에러 처리 정책을 어디에 둬야 하는지 불명확.
  - React 관점 위험: side effect가 여러 곳에 흩어져 cleanup 누락 위험 증가.

- 문제 3: 책임 경계가 섞여 있음
  - 실제 상황: `useMapMarkerControl`이 마커/오버레이 생성과 함께 bounds/pan 이동까지 담당.
  - 실수/고민 지점: 마커 UI 변경이 이동 로직에 영향.
  - React 관점 위험: 컴포넌트 의도(무엇을 그릴지)와 side effect(어떻게 이동할지)가 결합.

- 문제 4: 이벤트 정리가 분산됨
  - 실제 상황: 지도 클릭 이벤트만 `KakaoMap.tsx`에서 명시적으로 제거, 다른 이벤트는 훅 내부 로직에 흩어짐.
  - 실수/고민 지점: 어떤 이벤트가 어디서 해제되는지 추적이 어려움.
  - React 관점 위험: 언마운트 시 side effect cleanup 누락 가능.

- 문제 5: 폴리라인 타입 안정성 부족
  - 실제 상황: `usePolyline`에서 `pathPoints`, `polylineRef`가 `any`.
  - 실수/고민 지점: 동선 데이터 타입을 바꿀 때 컴파일 타임 보호가 없음.
  - React 관점 위험: 상태/효과 흐름에서 예상치 못한 런타임 오류 가능.

---

## 2. To-Be 아키텍처 설명

### 1) 현재 구조에서 가장 위험한 결합 지점

- 결합 지점 1: SDK 타입이 도메인 타입에 직접 노출됨
  - 결과: SDK 교체나 변경이 곧 앱 타입 변경으로 이어짐.

- 결합 지점 2: 지도 이벤트가 UI 컴포넌트에 직접 결합됨
  - 결과: UI 변경이 이벤트 정책 변경으로 이어지는 위험.

- 결합 지점 3: 마커/오버레이/이동/폴리라인 책임이 한 훅 흐름에서 섞임
  - 결과: 기능 추가/변경 시 영향 범위가 커짐.

### 2) 결합을 끊기 위한 최소 추상화

- Adapter 레이어
  - 없으면 생기는 문제: SDK 접근이 다시 분산되어 변경 범위 확대.
  - 책임 경계: `window.kakao` 접근과 SDK 객체 생성만 담당.

- Controller 레이어
  - 없으면 생기는 문제: 지도 생성/정리가 다시 화면 훅으로 흩어짐.
  - 책임 경계: 지도 인스턴스 생성, 초기화, relayout, registry 초기화/정리.

- Feature 레이어
  - 없으면 생기는 문제: 마커/오버레이/폴리라인/이벤트 로직이 다시 결합.
  - 책임 경계: 마커/오버레이/폴리라인/bounds/pan 기능 단위 API 제공.

- React Hook 레이어
  - 없으면 생기는 문제: 화면이 SDK-aware 코드로 돌아감.
  - 책임 경계: React 생명주기와 라이브러리 API 연결만 담당.

### 3) 설계 목적을 어떻게 만족하는지

- React 친화적 추상화
  - 컴포넌트/훅 기반 API(`useMap`, `useMarker` 등)를 제공해 선언형 흐름 유지.

- 생명주기/사이드이펙트 단순화
  - SDK 로딩, 이벤트 등록·해제, 오브젝트 정리를 hook/controller 내부에서 처리.

- TypeScript 안정성 확보
  - 앱 레이어에서 `window.kakao` 타입 노출 금지, 내부 타입으로 캡슐화.

- 실사용 예제 중심 문서화
  - 기존 화면(`RoutieSpace`) 흐름을 기반으로 Before/After 사용 흐름 제공.

- 반복 구현 제거
  - SDK 로더/초기화/cleanup을 라이브러리 API로 고정.

- 실제 사용하는 기능만 노출
  - 현재 코드에서 쓰는 기능만 API 범위로 제한.

### 4) 결과로 제안되는 라이브러리 구조

```
src/libs/map-sdk/
  adapters/
    kakaoMapAdapter.ts
  controllers/
    mapController.ts
  features/
    markers.ts
    polylines.ts
    overlays.ts
    events.ts
  hooks/
    useMapSdk.ts
    useMapController.ts
  types/
    adapter.types.ts
    map.types.ts
    feature.types.ts
```

- 이 구조를 이 범위로 제한한 이유
  - 현재 코드가 로딩/생성/마커/오버레이/폴리라인/이벤트로 책임이 분리되어 있어 1:1 이관이 가능하다.
  - 변경 범위를 `src/domains/maps` 내부에만 한정해 서비스 영향 없이 단계적으로 전환할 수 있다.

---

## 3. 스프린트 단위 계획

### Sprint 0: 라이브러리 경계/타입 도입

> 이 스프린트가 끝나면, SDK 접근을 한 곳으로 모으기 위한 기반이 생긴다.

- 시작 전 개발자가 겪는 불편
  - SDK 접근 위치가 분산되어 있어 어디부터 옮겨야 하는지 기준이 없다.

- 작업 내용
  - `src/libs/map-sdk/types/adapter.types.ts` 추가 (SDK 중립 타입 정의)
  - `src/libs/map-sdk/adapters/kakaoMapAdapter.ts` 스켈레톤 추가

- 선행 조건
  - 없음

- Definition of Done
  - 라이브러리 폴더 생성
  - 런타임 동작 변화 없음

- 먼저 마이그레이션할 화면/기능
  - 없음 (구조만 추가)

- 이 스프린트를 건너뛰면 생기는 문제
  - 이후 스프린트에서 SDK 접근 지점을 정리할 기준이 없어 변경이 산발적으로 발생한다.

- Before (개발자 사고 흐름)
  - "이 기능을 어디에 붙여야 하지? 기존 훅에 추가해야 하나?"
- After (개발자 사고 흐름)
  - "SDK 접근은 adapter에 두고, 그 외 로직은 라이브러리 구조에 맞춰 배치하면 된다."

### Sprint 1: SDK 로딩/지도 생성 통합

> 이 스프린트가 끝나면, 지도 생성 로직을 어디서든 같은 방식으로 다룰 수 있다.

- 시작 전 개발자가 겪는 불편
  - SDK 로딩과 지도 생성 로직이 화면 훅에 묶여 있어 재사용이 어렵다.

- 작업 내용
  - `src/libs/map-sdk/hooks/useMapSdk.ts` 추가
  - `src/libs/map-sdk/controllers/mapController.ts`에 지도 생성/relayout 추가
  - `useKakaoMapSDK`, `useKakaoMapInit`를 라이브러리 호출로 변경

- 선행 조건
  - Sprint 0

- Definition of Done
  - `useKakaoMapSDK`/`useKakaoMapInit`에서 `window.kakao` 직접 접근 제거

- 먼저 마이그레이션할 화면/기능
  - `src/pages/RoutieSpace/RoutieSpace.tsx` (KakaoMap 유지)

- 이 스프린트를 건너뛰면 생기는 문제
  - 이후 마커/이벤트 분리를 해도 초기화가 여전히 화면에 묶인다.

- Before
  - "SDK 로딩이 끝났는지 확인하고, containerRef가 있으면 Map을 직접 만든다."
- After
  - "useMapController가 준비되면 map instance를 제공하므로 생성 로직을 반복하지 않는다."

### Sprint 2: 마커/오버레이 기능 라이브러리화

> 이 스프린트가 끝나면, 마커와 오버레이는 같은 API로 추가/제거할 수 있다.

- 시작 전 개발자가 겪는 불편
  - 마커 추가 정책을 바꾸려면 이동/이벤트 로직까지 이해해야 한다.

- 작업 내용
  - `src/libs/map-sdk/features/markers.ts` 추가
  - `src/libs/map-sdk/features/overlays.ts` 추가
  - `useMapMarkerControl`, `useCustomOverlay`를 라이브러리 사용으로 변경

- 선행 조건
  - Sprint 1

- Definition of Done
  - 마커/오버레이 훅에서 `window.kakao` 직접 접근 제거

- 먼저 마이그레이션할 화면/기능
  - `src/domains/maps/components/KakaoMap/KakaoMap.tsx`

- 이 스프린트를 건너뛰면 생기는 문제
  - 이후 폴리라인/이벤트 분리 시 마커 결합 문제가 남는다.

- Before
  - "마커를 만들면서 클릭 이벤트와 이동까지 한 번에 처리해야 한다."
- After
  - "마커/오버레이는 feature API로 관리하고, UI는 이벤트 의도만 전달한다."

### Sprint 3: 폴리라인/네비게이션 기능 분리

> 이 스프린트가 끝나면, 동선과 이동 로직을 독립적으로 관리할 수 있다.

- 시작 전 개발자가 겪는 불편
  - 동선 표시 변경이 이동 정책과 얽혀 변경 범위가 넓다.

- 작업 내용
  - `src/libs/map-sdk/features/polylines.ts` 추가
  - `src/libs/map-sdk/features/events.ts` 또는 `navigation.ts` 추가
  - `usePolyline`, `useMapNavigation`을 라이브러리 사용으로 변경

- 선행 조건
  - Sprint 2

- Definition of Done
  - 폴리라인/네비게이션 훅에서 `window.kakao` 직접 접근 제거

- 먼저 마이그레이션할 화면/기능
  - `src/domains/maps/components/KakaoMap/KakaoMap.tsx`

- 이 스프린트를 건너뛰면 생기는 문제
  - 타입 안정화와 registry 도입이 지연된다.

- Before
  - "동선을 그리는 코드와 이동 로직을 함께 이해해야 한다."
- After
  - "동선과 이동은 feature 단위로 분리돼 각각 수정 가능하다."

### Sprint 4: 라이프사이클 훅 통합

> 이 스프린트가 끝나면, 지도 상태/수명주기를 하나의 훅에서 관리할 수 있다.

- 시작 전 개발자가 겪는 불편
  - 로딩/에러/맵 준비 상태를 위해 여러 훅을 동시에 이해해야 한다.

- 작업 내용
  - `src/libs/map-sdk/hooks/useMapController.ts` 추가
  - `useMapState`를 `useMapController` 기반으로 단순화
  - `src/domains/maps/types/api.types.ts`에서 SDK 타입 제거

- 선행 조건
  - Sprint 3

- Definition of Done
  - 앱 레이어 타입에서 `window.kakao` 의존 제거

- 먼저 마이그레이션할 화면/기능
  - `src/domains/maps/components/KakaoMap/KakaoMap.tsx`

- 이 스프린트를 건너뛰면 생기는 문제
  - SDK 타입 누수가 남아 라이브러리 경계가 깨진다.

- Before
  - "SDK 로딩 상태와 맵 상태를 따로 조합해 화면 상태를 만든다."
- After
  - "useMapController 하나로 로딩/에러/맵 준비 상태를 받는다."

### Sprint 5: 컴포넌트/이름 정리

> 이 스프린트가 끝나면, 앱 코드에서 kakao 전용 이름 없이 지도를 사용할 수 있다.

- 시작 전 개발자가 겪는 불편
  - 컴포넌트 이름만으로도 SDK 종속을 연상해야 한다.

- 작업 내용
  - `KakaoMap` 이름을 일반 명칭으로 변경 (예: `MapView`)
  - `src/pages/RoutieSpace/RoutieSpace.tsx` 업데이트
  - 불필요한 kakao 전용 훅/파일 정리

- 선행 조건
  - Sprint 4

- Definition of Done
  - 앱 코드에서 `kakao` 직접 식별자 사용 제거
  - 라이브러리 public API 확정

- 먼저 마이그레이션할 화면/기능
  - `src/pages/RoutieSpace/RoutieSpace.tsx`

- 이 스프린트를 건너뛰면 생기는 문제
  - SDK 교체 시 명명 변경 범위가 커져 리팩터링 비용 증가.

- Before
  - "KakaoMap 컴포넌트를 직접 사용해야 한다."
- After
  - "SDK와 무관한 컴포넌트/훅 이름으로 지도를 쓴다."

---

## 4. 리스크 및 한계

- SDK 로드 타이밍 변화 리스크
  - 언제 터질 수 있는지: `public/index.html`의 스크립트 로딩 정책이 변경될 때.
  - 영향 범위: 초기 지도 렌더링이 필요한 `RoutieSpace` 화면.
  - 흡수 가능 범위: adapter에서 로딩 정책을 일관화하면 대부분 흡수 가능.

- 폴리라인 타입 마이그레이션 리스크
  - 언제 터질 수 있는지: `usePolyline`의 `any` 타입을 내부 타입으로 전환할 때.
  - 영향 범위: 동선 표시 기능.
  - 흡수 가능 범위: feature 레이어에서 타입 정의를 표준화하면 흡수 가능.

- 이벤트 정리 누락 리스크
  - 언제 터질 수 있는지: 이벤트 추가/변경 시 해제 코드가 누락될 때.
  - 영향 범위: 지도 클릭, 마커 클릭 후 오버레이 표시.
  - 흡수 가능 범위: events feature에서 등록/해제 규칙을 통일하면 흡수 가능.

- bounds/pan 타이밍 의존 리스크
  - 언제 터질 수 있는지: `setTimeout` 기반 이동 로직이 변경될 때.
  - 영향 범위: 초기 지도 피팅, 신규 장소 추가 후 이동.
  - 흡수 가능 범위: controller에서 타이밍 정책을 고정하면 일부 흡수 가능.
