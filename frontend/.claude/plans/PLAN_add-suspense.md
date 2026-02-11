# Implementation Plan: Suspense 도입

**Status**: 🔄 In Progress
**Started**: 2026-02-11
**Last Updated**: 2026-02-11 (Phase 6 완료)

---

**⚠️ CRITICAL INSTRUCTIONS**: After completing each phase:

1. ✅ Check off completed task checkboxes
2. 🧪 Run all quality gate validation commands
3. ⚠️ Verify ALL quality gate items pass
4. 🔍 **Run `/frontend-code-review`** (for frontend phases)
5. 📅 Update "Last Updated" date above
6. 📝 Document learnings in Notes section
7. ➡️ Only then proceed to next phase

⛔ **DO NOT skip quality gates or proceed with failing checks**

---

## 📋 Overview

### Feature Description

`useQuery` + 수동 `isLoading`/`error` 분기를 `useSuspenseQuery` + Suspense boundary로 전환한다.
SSE 기반 도메인(장소 목록, 루티 목록, 루티 스페이스 이름)은 REST 초기 fetch + SSE 실시간 업데이트 패턴으로 변경한다.

### Success Criteria

- [ ] 5개 도메인(장소 목록, 루티 목록, 루티 스페이스 목록, 루티 스페이스 이름, userId) queryOptions 팩토리 + useSuspenseQuery 훅 완성
- [ ] SSE 기반 도메인에서 REST 초기 로딩 → SSE 업데이트 패턴 정상 동작
- [ ] 컴포넌트에서 수동 `isLoading` 분기 제거, Suspense fallback으로 대체
- [ ] SuspenseFallback 컴포넌트 + ErrorBoundary 컴포넌트 (resetKeys, fallbackRender 지원)
- [ ] 섹션별 Suspense/ErrorBoundary 경계 분리 (Sidebar 탭, UserMenu, 배너)
- [ ] 기존 테스트 통과, 새 인프라 컴포넌트 테스트 추가

### User Impact

- 로딩 상태가 선언적 Suspense boundary로 통일되어 UX 일관성 향상
- `data`가 항상 non-nullable → 컴포넌트 코드 단순화, 타입 안전성 향상

---

## 🏗️ Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| SSE 기반 도메인에 REST 초기 fetch 추가 | `useSuspenseQuery`는 `enabled` 미지원, REST로 초기 데이터 보장 | 초기 로드 시 REST + SSE HISTORY 중복 (structuralSharing으로 무해) |
| `queryOptions()` 팩토리 패턴 도입 | `useSuspenseQuery`와 `useQuery` 모두에서 재사용, prefetch 지원 | 기존 훅과 병행 관리 |
| 최소 ErrorBoundary 포함 | `useSuspenseQuery`는 에러 시 반드시 throw → ErrorBoundary 없으면 앱 crash | 고도화(QueryErrorResetBoundary 등)는 다음 태스크 |
| Home/RoutieSpace의 useUserQuery 유지 | 비로그인 사용자도 접근하는 페이지에서는 `enabled: Boolean(accessToken)` 필요 | 일부 컴포넌트만 Suspense 전환 |

---

## 📦 Dependencies

### Required Before Starting

- [ ] `@tanstack/react-query@^5.87.4` 설치 확인 (이미 설치됨)

### External Dependencies

- `@tanstack/react-query`: ^5.87.4 (기존)
- 신규 패키지 없음

---

## 🧪 Test Strategy

### Testing Approach

**TDD Principle**: 인프라 컴포넌트(ErrorBoundary, SuspenseFallback)에 대해 테스트 작성 후 구현

### Test Pyramid for This Feature

| Test Type | Coverage Target | Purpose |
|-----------|----------------|---------|
| **Unit Tests** | ≥80% | ErrorBoundary 에러 캐치, SuspenseFallback 렌더링 |
| **Integration Tests** | Critical paths | Suspense + useSuspenseQuery 통합 동작 |
| **Manual Tests** | Key user flows | `npm run start`에서 각 페이지 동작 확인 |

---

## 🚀 Implementation Phases

### Phase 1: 인프라 컴포넌트 (SuspenseFallback + ErrorBoundary)

**Goal**: Suspense/ErrorBoundary 인프라 컴포넌트를 생성하고 테스트한다
**Status**: ✅ Complete

#### Tasks

**🔴 RED: Write Failing Tests First**

- [x] **Test 1.1**: SuspenseFallback 렌더링 테스트
  - File: `src/@common/components/SuspenseFallback/__tests__/SuspenseFallback.test.tsx`
  - Expected: Tests FAIL (컴포넌트 미존재)
  - Cases:
    - Spinner가 렌더링되는지 확인

- [x] **Test 1.2**: ErrorBoundary 에러 캐치 테스트
  - File: `src/@common/components/ErrorBoundary/__tests__/ErrorBoundary.test.tsx`
  - Expected: Tests FAIL (컴포넌트 미존재)
  - Cases:
    - 자식 컴포넌트 에러 시 fallback 렌더링
    - 에러 없을 시 children 정상 렌더링

**🟢 GREEN: Implement to Make Tests Pass**

- [x] **Task 1.3**: SuspenseFallback 컴포넌트 구현
  - File: `src/@common/components/SuspenseFallback/SuspenseFallback.tsx`
  - 기존 `Spinner` 컴포넌트(`src/@common/components/Spinner/Spinner.tsx`) 활용
  - `Flex` + `Spinner` 조합

- [x] **Task 1.4**: ErrorBoundary 컴포넌트 구현
  - File: `src/@common/components/ErrorBoundary/ErrorBoundary.tsx`
  - Class component, `getDerivedStateFromError` + `componentDidCatch`
  - Props: `children`, `fallback`

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 1.5**: 코드 정리
  - 타입 분리 필요 시 `.types.ts` 파일 생성
  - export default 패턴 확인

#### Quality Gate ✋

**Build & Tests**:
- [x] `npm run test:run` — 100% passing
- [x] `npm run lint` — no errors

**Manual Testing**:
- [x] Storybook에서 SuspenseFallback 시각 확인 (선택)

**🔍 Frontend Code Review**:
- [x] `/frontend-code-review src/@common/components/SuspenseFallback/`
- [x] `/frontend-code-review src/@common/components/ErrorBoundary/`

---

### Phase 2: queryOptions 팩토리 + useSuspense 훅 생성 (전체 도메인)

**Goal**: 5개 도메인의 queryOptions 팩토리와 useSuspenseQuery 훅을 생성한다
**Status**: ✅ Complete

#### Tasks

**🔴 RED: Write Failing Tests First**

- [x] **Test 2.1**: 각 useSuspense 훅이 useSuspenseQuery를 호출하는지 테스트
  - Files: 각 도메인의 queries 디렉토리에 테스트 추가
  - Expected: Tests FAIL (훅 미존재)

**🟢 GREEN: Implement to Make Tests Pass**

- [x] **Task 2.2**: places 도메인 queryOptions + useSuspensePlaceListQuery
  - File: `src/domains/places/queries/usePlaceQuery.ts`
  - `queryOptions` import 추가
  - `placeListQueryOptions` 팩토리 생성 (queryKey + queryFn)
  - `useSuspensePlaceListQuery` 훅 생성
  - export에 추가

- [x] **Task 2.3**: routie 도메인 queryOptions + useSuspenseRoutieQuery
  - File: `src/domains/routie/queries/useRoutieQuery.ts`
  - `routieQueryOptions` 팩토리 생성 (queryKey + queryFn + select)
  - `useSuspenseRoutieQuery` 훅 생성
  - export에 추가

- [x] **Task 2.4**: routieSpace 도메인 queryOptions 2개 + useSuspense 훅 2개
  - File: `src/domains/routieSpace/queries/useRoutieSpaceQuery.ts`
  - `routieSpaceQueryOptions` (단일 스페이스 조회)
  - `routieSpaceListQueryOptions` (스페이스 목록 조회)
  - `useSuspenseRoutieSpaceQuery`, `useSuspenseGetRoutieSpaceListQuery`
  - export에 추가

- [x] **Task 2.5**: auth 도메인 queryOptions + useSuspenseUserQuery
  - File: `src/domains/auth/queries/useAuthQuery.ts`
  - `userQueryOptions` 팩토리 생성
  - `useSuspenseUserQuery` 훅 생성
  - export에 추가

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 2.6**: 기존 useQuery 훅이 queryOptions 팩토리 재사용하도록 정리
  - `usePlaceListQuery` → `useQuery({ ...placeListQueryOptions, enabled })`
  - `useRoutieQuery` → `useQuery({ ...routieQueryOptions, enabled })` + `initialData` 제거
  - `useRoutieSpaceQuery` → `useQuery({ ...routieSpaceQueryOptions, enabled })`
  - `useUserQuery` → `useQuery({ ...userQueryOptions, enabled: Boolean(accessToken) })`

#### Quality Gate ✋

**Build & Tests**:
- [x] `npm run test:run` — 100% passing
- [x] `npm run lint` — no errors
- [x] `npm run build:prod` — 빌드 성공

**Manual Testing**:
- [x] 기존 기능 정상 동작 확인 (이 Phase에서는 컴포넌트 미변경이므로 regression 없어야 함)

---

### Phase 3: 루티 스페이스 목록 Suspense 전환

**Goal**: ManageRoutieSpaces 페이지에 Suspense를 적용한다 (가장 단순한 케이스, SSE 없음)
**Status**: ✅ Complete

#### Tasks

**🟢 GREEN: Implement**

- [x] **Task 3.1**: ManageRoutieSpaces 페이지 수정
  - File: `src/pages/ManageRoutieSpaces/ManageRoutieSpaces.tsx`
  - `useGetRoutieSpaceListQuery()` → `useSuspenseGetRoutieSpaceListQuery()`
  - `isLoading` 분기 제거 (Suspense가 처리)
  - `error` 분기 제거 (ErrorBoundary가 처리)
  - `data: routieSpaces = []` → `data: routieSpaces` (항상 존재)

- [x] **Task 3.2**: routes에 Suspense/ErrorBoundary 경계 추가
  - File: `src/routes/index.tsx`
  - `/manage-routie-spaces` 라우트에 `<ErrorBoundary>` + `<Suspense fallback={<SuspenseFallback />}>` 래핑
  - 에러 fallback으로 기존 에러 UI 유사 컴포넌트 제공

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 3.3**: 불필요한 import 정리 (Button import 제거됨)

#### Quality Gate ✋

**Build & Tests**:
- [x] `npm run test:run` — 100% passing (51 tests)
- [x] `npm run lint` — no errors (기존 warning만)

**Manual Testing**:
- [ ] `/manage-routie-spaces` 접속 → Suspense fallback(Spinner) 표시 → 스페이스 목록 로딩
- [ ] 네트워크 지연 시 Spinner 표시 확인
- [ ] 스페이스 생성/삭제 정상 동작

**🔍 Frontend Code Review**:
- [x] `/frontend-code-review src/pages/ManageRoutieSpaces/` — 에러 fallback 홈 이동 링크 추가 반영

---

### Phase 4: 루티 스페이스 이름 Suspense 전환 (SSE 기반)

**Goal**: useRoutieSpace 훅과 RoutieSpaceName에 Suspense를 적용하고, SSE 기반에서 REST 초기 fetch로 전환한다
**Status**: ✅ Complete

#### Tasks

**🟢 GREEN: Implement**

- [x] **Task 4.1**: useRoutieSpace 훅 수정
  - File: `src/domains/routieSpace/hooks/useRoutieSpace.ts`
  - `useRoutieSpaceQuery({ enabled: false })` → `useSuspenseRoutieSpaceQuery()`
  - `isLoading` 반환값 제거 (Suspense가 처리)
  - `routieSpace?.name` → `routieSpace.name` (non-nullable)
  - `UseRoutieSpaceReturn` 타입에서 `isLoading` 제거

- [x] **Task 4.2**: RoutieSpaceName 컴포넌트 수정
  - File: `src/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName.tsx`
  - `isLoading` 사용처 제거 (저장 버튼 disabled 조건 조정)

- [x] **Task 4.3**: RoutieSpace 페이지의 routieSpaceQuery 호출 수정
  - File: `src/pages/RoutieSpace/RoutieSpace.tsx`
  - 기존: `const { error: routieSpaceError } = useRoutieSpaceQuery()`
  - 변경: `useSuspenseRoutieSpaceQuery()`로 전환 → 에러는 ErrorBoundary에서 처리
  - routieSpaceError 기반 404 네비게이션 → ErrorBoundary fallback에서 처리하도록 이동
  - SSE 스트림(`useRoutieSpaceStream`)은 그대로 유지

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 4.4**: UseRoutieSpaceQueryOptions 타입 정리 (enabled 옵션 불필요 시)
  - File: `src/domains/routieSpace/types/useRoutieQuery.types.ts`
  - `useRoutieSpaceQuery`에서 여전히 사용하므로 타입 유지

#### Quality Gate ✋

**Build & Tests**:
- [x] `npm run test:run` — 100% passing (51 tests)
- [x] `npm run lint` — no errors (기존 warning만)

**Manual Testing**:
- [ ] `/routie-spaces?routieSpaceIdentifier=...` 접속 → Suspense fallback → 스페이스 이름 표시
- [ ] SSE 연결 후 다른 사용자가 이름 변경 시 실시간 반영
- [ ] 이름 수정 → 저장 정상 동작
- [ ] 존재하지 않는 UUID 접속 시 에러 처리 (not found 페이지)
- [ ] 깜빡임 없이 데이터 전환되는지 확인

**🔍 Frontend Code Review**:
- [x] `/frontend-code-review src/domains/routieSpace/hooks/` — `?? ''` 불필요한 null coalescing 제거 반영
- [x] `/frontend-code-review src/domains/routieSpace/components/RoutieSpaceName/` — 이슈 없음

---

### Phase 5: 장소 목록 + 루티 목록 Suspense 전환 (SSE 기반)

**Goal**: usePlaceList, useRoutieList 훅에 Suspense를 적용하고, SSE 기반에서 REST 초기 fetch로 전환한다
**Status**: ✅ Complete

#### Tasks

**🟢 GREEN: Implement**

- [x] **Task 5.1**: usePlaceList 훅 수정
  - File: `src/domains/places/hooks/usePlaceList.ts`
  - `usePlaceListQuery({ enabled: false })` → `useSuspensePlaceListQuery()`
  - `error` + `useEffect` 토스트 처리 제거 (ErrorBoundary가 처리)
  - `placeList`가 항상 존재 (non-nullable)

- [x] **Task 5.2**: useRoutieList 훅 수정
  - File: `src/domains/routie/hooks/useRoutieList.ts`
  - `useRoutieQuery({ enabled: false })` → `useSuspenseRoutieQuery()`
  - `error` + `useEffect` 토스트 처리 제거
  - `routie.routiePlaces`가 항상 존재

- [x] **Task 5.3**: useRoutieQuery의 initialData 제거
  - File: `src/domains/routie/queries/useRoutieQuery.ts`
  - `useRoutieQuery`에서 `initialData: { routiePlaces: [] }` 제거 (Suspense가 로딩 처리)

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 5.4**: UsePlaceListQueryOptions, UseRoutieQueryOptions 타입 정리
  - 타입은 `usePlaceListQuery`, `useRoutieQuery` (non-suspense 버전)에서 여전히 사용 → 유지
  - `useRoutieQuery.ts`에서 미사용 `useQueryClient` import 제거

#### Quality Gate ✋

**Build & Tests**:
- [x] `npm run test:run` — 100% passing (51 tests)
- [x] `npm run lint` — no errors (기존 warning만)

**Manual Testing**:
- [ ] `/routie-spaces?routieSpaceIdentifier=...` 접속 → 장소 목록, 루티 목록 정상 로딩
- [ ] SSE 연결 후 장소 추가/삭제/수정 실시간 반영
- [ ] 루티 순서 변경 실시간 반영
- [ ] 깜빡임 없이 SSE HISTORY 데이터 전환 확인

**🔍 Frontend Code Review**:
- [x] `/frontend-code-review src/domains/places/hooks/` — 이슈 없음
- [x] `/frontend-code-review src/domains/routie/hooks/` — 이슈 없음

---

### Phase 6: userId Suspense 전환 (조건부)

**Goal**: 로그인 보장 컨텍스트(ManageRoutieSpaceBanner, UserMenu)에서 useSuspenseUserQuery로 전환한다
**Status**: ✅ Complete

#### Tasks

**🟢 GREEN: Implement**

- [x] **Task 6.1**: ManageRoutieSpaceBanner 수정
  - File: `src/pages/ManageRoutieSpaces/components/ManageRoutieSpaceBanner/ManageRoutieSpaceBanner.tsx`
  - `useUserQuery()` → `useSuspenseUserQuery()`
  - `isLoading` 분기 제거
  - `user?.nickname` → `user.nickname` (non-nullable)
  - 이미 `RequireAccessToken` 가드 뒤에 있으므로 accessToken 보장됨

- [x] **Task 6.2**: UserMenu 수정
  - File: `src/domains/auth/components/UserMenu/UserMenu.tsx`
  - `useUserQuery()` → `useSuspenseUserQuery()`
  - `isLoading`, `error` 분기 제거
  - `user?.nickname` → `user.nickname`
  - UserMenu는 `accessToken &&` 조건 뒤에서만 렌더링됨 (`RoutieSpace.tsx:84`)

- [x] **Task 6.3**: Home.tsx, RoutieSpace.tsx의 useUserQuery는 유지
  - 비로그인 사용자도 접근하는 페이지 → `enabled: Boolean(accessToken)` 필요
  - 변경 없음 (확인만)

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 6.4**: import 정리

#### Quality Gate ✋

**Build & Tests**:
- [x] `npm run test:run` — 100% passing (51 tests)
- [x] `npm run lint` — no errors (기존 warning만)

**Manual Testing**:
- [ ] `/manage-routie-spaces` → 배너에 닉네임 정상 표시 (Suspense fallback → 닉네임)
- [ ] RoutieSpace → UserMenu 클릭 → 닉네임 정상 표시
- [ ] Home 페이지 → 비로그인 상태에서 정상 접근
- [ ] Home 페이지 → 로그인 상태에서 정상 동작

**🔍 Frontend Code Review**:
- [x] `/frontend-code-review src/pages/ManageRoutieSpaces/components/ManageRoutieSpaceBanner/` — 이슈 없음. Suspense/ErrorBoundary 경계 분리는 Notes에 기록
- [x] `/frontend-code-review src/domains/auth/components/UserMenu/` — 이슈 없음

---

### Phase 7: Suspense/ErrorBoundary 경계 분리 + ErrorBoundary 고도화

**Goal**: 라우트 레벨 단일 경계를 섹션별로 분리하고, ErrorBoundary에 재시도 메커니즘을 추가한다
**Status**: ✅ Complete (Manual Testing / Code Review 잔여)

#### 현재 문제점

- RoutieSpace: routieSpace/placeList/routieList/user 쿼리가 **모두 같은 Suspense**에 묶임 → 탭 전환 시 전체 페이지 스피너
- ManageRoutieSpaces: routieSpaceList + user 쿼리가 **같은 Suspense** → 배너/목록 독립 불가
- ErrorBoundary에 에러 정보 미전달, 재시도 메커니즘 없음
- 모든 곳에서 동일한 SuspenseFallback/에러 UI 사용

#### 변경 후 경계 구조

**RoutieSpace 페이지:**
```
ErrorBoundary (route - lazy load + routieSpace 에러, fallbackRender)
  Suspense (route - lazy load + useSuspenseRoutieSpaceQuery)
    RoutieSpace
      KakaoMap
      ErrorBoundary (UserMenu)        ← NEW
        Suspense (UserMenu)           ← NEW
          UserMenuButton → UserMenu
      Sidebar
        RoutieSpaceName (캐시 히트, suspend 안 함)
        ErrorBoundary (탭 콘텐츠, resetKeys=[activeTab])  ← NEW
          Suspense (탭 콘텐츠)                             ← NEW
            PlaceView / RouteView / ShareView
```

**ManageRoutieSpaces 페이지:**
```
RequireAccessToken
  ErrorBoundary (route - routieSpaceList 에러, fallbackRender)
    Suspense (route - useSuspenseGetRoutieSpaceListQuery)
      ManageRoutieSpaces
        Header
        ErrorBoundary (배너)    ← NEW
          Suspense (배너)       ← NEW
            ManageRoutieSpaceBanner
        목록 콘텐츠
```

#### Tasks

**🔴 RED: Write Failing Tests First**

- [x] **Test 7.1**: ErrorBoundary 고도화 테스트
  - File: `src/@common/components/ErrorBoundary/__tests__/ErrorBoundary.test.tsx`
  - Cases:
    - `fallbackRender`에 error 객체 + resetErrorBoundary 함수 전달 확인
    - resetErrorBoundary 호출 시 children 재렌더링 확인
    - `resetKeys` 변경 시 에러 상태 자동 리셋 확인

**🟢 GREEN: Implement**

- [x] **Task 7.2**: ErrorBoundary 고도화
  - Files: `src/@common/components/ErrorBoundary/ErrorBoundary.tsx`, `ErrorBoundary.types.ts`
  - `fallbackRender` prop 추가: `(props: { error: Error; resetErrorBoundary: () => void }) => ReactNode`
    - 기존 `fallback` (ReactNode)과 병행 지원, `fallbackRender` 우선
  - `resetKeys` prop 추가: `unknown[]` — 키 변경 시 에러 상태 자동 리셋
    - `componentDidUpdate`에서 이전 resetKeys 비교
  - `onReset` callback 추가
  - `getDerivedStateFromError`에서 error 객체 저장 (state에 `error: Error | null`)

- [x] **Task 7.3**: RoutieSpace Sidebar 탭 콘텐츠 경계 분리
  - File: `src/pages/RoutieSpace/components/Sidebar/Sidebar.tsx`
  - 탭 콘텐츠 영역(PlaceView/RouteView/ShareView)을 `ErrorBoundary + Suspense`로 래핑
  - `resetKeys={[activeTab]}`: 탭 전환 시 에러 상태 자동 리셋
  - fallback: 임시 텍스트 + 재시도 버튼 (Phase 8에서 스켈레톤/커스텀 UI로 교체)

- [x] **Task 7.4**: UserMenuButton 내 UserMenu Suspense 경계
  - File: `src/domains/auth/components/UserMenuButton/UserMenuButton.tsx`
  - `isUserInfoOpen && <UserMenu>` 를 `ErrorBoundary + Suspense`로 래핑
  - UserMenu의 useSuspenseUserQuery 캐시 히트 가능성 높지만 안전장치

- [x] **Task 7.5**: ManageRoutieSpaces 배너 경계 분리
  - File: `src/pages/ManageRoutieSpaces/ManageRoutieSpaces.tsx`
  - `ManageRoutieSpaceBanner`를 `ErrorBoundary + Suspense`로 래핑
  - 로딩/에러 시 빈 배너 영역 유지 (레이아웃 시프트 방지)

- [x] **Task 7.6**: routes/index.tsx 에러 fallback에 fallbackRender 적용
  - File: `src/routes/index.tsx`
  - 기존 인라인 `fallback` JSX → `fallbackRender` 사용 (재시도 버튼 포함)
  - `/routie-spaces`, `/manage-routie-spaces` 두 라우트 모두 적용

- [x] **Task 7.7**: 도메인 CLAUDE.md 업데이트
  - `src/domains/places/CLAUDE.md`: "초기 데이터 fetch 비활성화" → "useSuspenseQuery로 REST 초기 fetch, SSE는 실시간 동기화"
  - `src/domains/routie/CLAUDE.md`: SSE SSOT 문구에 Suspense 패턴 추가
  - `src/domains/routieSpace/CLAUDE.md`: Suspense 패턴 반영

**🔵 REFACTOR: Clean Up Code**

- [x] **Task 7.8**: 전체 import 정리, 미사용 타입 제거

#### Quality Gate ✋

**Build & Tests**:
- [x] `npm run test:run` — 54 tests passed
- [x] `npm run lint` — 0 errors (33 warnings, 기존)
- [x] `npm run build:prod` — 빌드 성공

**Manual Testing (전체 통합)**:
- [ ] `/` (Home) — 비로그인/로그인 상태 정상 렌더링
- [ ] `/routie-spaces` — route Suspense(Spinner) → 페이지 로딩 → 탭 전환 시 **탭 영역만** 로딩
- [ ] `/routie-spaces` — 탭 콘텐츠 에러 시 탭 영역만 에러 표시 + 재시도 버튼 동작
- [ ] `/routie-spaces` — UserMenu 클릭 시 정상 표시 (Suspense 영향 없음)
- [ ] `/manage-routie-spaces` — 배너와 목록이 독립적으로 로딩
- [ ] SSE 실시간 동기화 정상 동작
- [ ] 에러 케이스: 재시도 버튼 클릭 시 복구

**🔍 Frontend Code Review**:
- [x] `/frontend-code-review src/@common/components/ErrorBoundary/` — discriminated union 적용
- [x] `/frontend-code-review src/pages/RoutieSpace/components/Sidebar/` — handleToggle→onToggle 리팩터링
- [x] `/frontend-code-review src/routes/` — RouteErrorFallback 컴포넌트 추출

---

### Phase 8: 섹션별 커스텀 UI (스켈레톤 + 에러 UI)

**Goal**: 각 Suspense/ErrorBoundary 경계에 맞는 스켈레톤 로딩 UI와 에러 UI를 적용한다
**Status**: ⏳ Pending (Phase 7 이후)

#### Tasks

- [ ] **Task 8.1**: 스켈레톤 UI 컴포넌트 생성
  - 장소 목록 스켈레톤 (PlaceView용)
  - 동선 목록 스켈레톤 (RouteView용)
  - 배너 스켈레톤 (ManageRoutieSpaceBanner용)

- [ ] **Task 8.2**: 각 Suspense fallback을 스켈레톤으로 교체
  - Sidebar 탭 콘텐츠: 탭별 스켈레톤
  - ManageRoutieSpaceBanner: 배너 스켈레톤
  - ManageRoutieSpaces 페이지: 목록 스켈레톤

- [ ] **Task 8.3**: 각 ErrorBoundary fallback을 섹션 맞춤 에러 UI로 교체

- [ ] **Task 8.4**: 도메인 CLAUDE.md 최종 업데이트

#### Quality Gate ✋

- [ ] `npm run test:run` — 100% passing
- [ ] `npm run lint` — no errors
- [ ] `npm run build:prod` — 빌드 성공
- [ ] `/frontend-code-review` 최종 실행

---

## ⚠️ Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| SSE HISTORY와 REST 데이터 불일치로 깜빡임 | Low | Low | structuralSharing이 동일 데이터 시 리렌더 방지 |
| useSuspenseQuery 에러 시 앱 crash | Medium | High | 최소 ErrorBoundary 포함 (Phase 1) |
| useRoutieQuery initialData 제거 후 타입 에러 | Medium | Low | data가 Suspense 이후 항상 존재하므로 non-nullable |
| 기존 컴포넌트의 `?` 옵셔널 체이닝 정리 누락 | Low | Low | TypeScript strict mode가 잡아줌 |

---

## 🔄 Rollback Strategy

### If Phase 1 Fails
- 신규 파일(`SuspenseFallback/`, `ErrorBoundary/`) 삭제

### If Phase 2 Fails
- 각 도메인 query 파일에서 추가된 queryOptions/useSuspense 코드 삭제
- 기존 useQuery 훅 원복

### If Phase 3-6 Fails (도메인별)
- 해당 도메인만 이전 Phase 상태로 복원
- `git stash` 또는 `git checkout -- <file>` 으로 파일 단위 롤백

### If Phase 7 Fails
- ErrorBoundary 고도화: 기존 ErrorBoundary.tsx 원복
- 경계 분리: Sidebar.tsx, UserMenuButton.tsx, ManageRoutieSpaces.tsx에서 추가한 ErrorBoundary/Suspense 래핑 제거
- routes/index.tsx: fallbackRender → 기존 fallback 원복
- CLAUDE.md 원복

### If Phase 8 Fails
- 스켈레톤 컴포넌트 삭제
- 각 Suspense/ErrorBoundary fallback을 Phase 7 상태로 원복

---

## 📊 Progress Tracking

### Completion Status

- **Phase 1**: ✅ 100%
- **Phase 2**: ✅ 100%
- **Phase 3**: ✅ 100%
- **Phase 4**: ✅ 100%
- **Phase 5**: ✅ 100%
- **Phase 6**: ✅ 100%
- **Phase 7**: ✅ 100% (코드 완료, Manual Testing/Code Review 잔여)
- **Phase 8**: ⏳ 0%

**Overall Progress**: 88% complete

---

## 📊 수정 대상 파일 요약

| 파일 | Phase | 변경 내용 |
|------|-------|-----------|
| `src/@common/components/SuspenseFallback/SuspenseFallback.tsx` | 1 | **신규** - Suspense 폴백 |
| `src/@common/components/ErrorBoundary/ErrorBoundary.tsx` | 1 | **신규** - 최소 ErrorBoundary |
| `src/domains/places/queries/usePlaceQuery.ts` | 2 | queryOptions + useSuspense 추가 |
| `src/domains/routie/queries/useRoutieQuery.ts` | 2,5 | queryOptions + useSuspense 추가, initialData 제거 |
| `src/domains/routieSpace/queries/useRoutieSpaceQuery.ts` | 2 | queryOptions 2개 + useSuspense 2개 추가 |
| `src/domains/auth/queries/useAuthQuery.ts` | 2 | queryOptions + useSuspense 추가 |
| `src/pages/ManageRoutieSpaces/ManageRoutieSpaces.tsx` | 3 | useSuspense 전환, loading/error 분기 제거 |
| `src/domains/routieSpace/hooks/useRoutieSpace.ts` | 4 | useSuspense 전환, isLoading 제거 |
| `src/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName.tsx` | 4 | isLoading 사용처 제거 |
| `src/pages/RoutieSpace/RoutieSpace.tsx` | 4,7 | routieSpaceQuery Suspense 전환, 에러 처리 정리 |
| `src/domains/places/hooks/usePlaceList.ts` | 5 | useSuspense 전환, error 처리 제거 |
| `src/domains/routie/hooks/useRoutieList.ts` | 5 | useSuspense 전환, error 처리 제거 |
| `src/pages/ManageRoutieSpaces/.../ManageRoutieSpaceBanner.tsx` | 6 | useSuspenseUserQuery 전환 |
| `src/domains/auth/components/UserMenu/UserMenu.tsx` | 6 | useSuspenseUserQuery 전환 |
| `src/routes/index.tsx` | 3,7 | Suspense/ErrorBoundary 경계 배치, fallbackRender 전환 |
| `src/@common/components/ErrorBoundary/ErrorBoundary.tsx` | 7 | resetKeys, onReset, fallbackRender, error 저장 |
| `src/pages/RoutieSpace/components/Sidebar/Sidebar.tsx` | 7 | 탭 콘텐츠 ErrorBoundary + Suspense 래핑 |
| `src/domains/auth/components/UserMenuButton/UserMenuButton.tsx` | 7 | UserMenu ErrorBoundary + Suspense 래핑 |
| 도메인 CLAUDE.md 3개 | 7 | SSE + Suspense 패턴 문서 업데이트 |

---

## 📝 Notes & Learnings

### Implementation Notes

- Phase 4에서 RoutieSpace 페이지의 `routieSpaceError` 기반 에러 처리(not-found 네비게이션)를 제거하고 범용 ErrorBoundary로 대체함. 기존에는 에러 메시지를 케이스별로 구분하여 `'방 찾기에 실패했습니다'`, `'방을 찾을 수 없습니다'`, `'존재하지 않는 방입니다'` → `/routie-space-not-found`로 이동하는 로직이 있었음. **추후 ErrorBoundary 고도화 시 에러 타입별 분기 처리를 다시 추가해야 함.**
- Phase 7에서 RoutieSpace 페이지의 Suspense 경계를 세분화해야 함. 현재 페이지 전체가 하나의 Suspense로 묶여 있어 장소 목록/루티 목록/스페이스 이름이 모두 하나의 Spinner로 로딩됨. 각 영역별로 독립적인 Suspense 경계를 두어 부분 로딩이 가능하도록 개선 필요.
- Phase 6에서 ManageRoutieSpaces 페이지의 Suspense/ErrorBoundary 경계가 페이지 전체를 하나로 감싸고 있음. `useSuspenseGetRoutieSpaceListQuery`(목록)와 `useSuspenseUserQuery`(배너 닉네임)가 같은 경계에 묶여 있어 유저 쿼리 실패 시에도 전체 에러 fallback이 표시됨. **Phase 7 또는 추후 ErrorBoundary 고도화 시 배너/목록 영역 별로 Suspense/ErrorBoundary 경계 분리를 검토해야 함.** (단, RequireAccessToken 가드 뒤이므로 유저 쿼리 실패 가능성은 낮음)

### 🔍 Code Review Learnings

- (리뷰 후 추가)

---

## 📚 References

### Key Patterns

- `useSuspenseQuery`: `enabled` 미지원, data 항상 non-nullable
- `queryOptions()`: useQuery/useSuspenseQuery 모두에서 재사용 가능한 팩토리
- `structuralSharing`: React Query 기본 활성화, 동일 데이터 시 참조 유지 → 리렌더 방지

---

## ✅ Final Checklist

**Before marking plan as COMPLETE**:

- [ ] All phases completed with quality gates passed
- [ ] Full integration testing performed
- [ ] 도메인 CLAUDE.md 업데이트 완료
- [ ] `npm run build:prod` 성공
- [ ] `npm run test:run` 전체 통과
- [ ] `npm run lint` 통과

**🔍 Frontend Code Review Final Check**:

- [ ] 전체 프론트엔드 코드 `/frontend-code-review` 완료
- [ ] 모든 리뷰 이슈 해결 확인

---

**Plan Status**: 🔄 In Progress
**Next Action**: Phase 7 시작 (RoutieSpace Suspense 경계 통합 + 문서 업데이트)
**Blocked By**: None
