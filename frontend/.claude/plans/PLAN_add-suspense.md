# Implementation Plan: Suspense 도입

**Status**: 🔄 In Progress
**Started**: 2026-02-11
**Last Updated**: 2026-02-11

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
- [ ] SuspenseFallback 컴포넌트 + 최소 ErrorBoundary 컴포넌트 추가
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
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**

- [ ] **Test 1.1**: SuspenseFallback 렌더링 테스트
  - File: `src/@common/components/SuspenseFallback/__tests__/SuspenseFallback.test.tsx`
  - Expected: Tests FAIL (컴포넌트 미존재)
  - Cases:
    - Spinner가 렌더링되는지 확인

- [ ] **Test 1.2**: ErrorBoundary 에러 캐치 테스트
  - File: `src/@common/components/ErrorBoundary/__tests__/ErrorBoundary.test.tsx`
  - Expected: Tests FAIL (컴포넌트 미존재)
  - Cases:
    - 자식 컴포넌트 에러 시 fallback 렌더링
    - 에러 없을 시 children 정상 렌더링

**🟢 GREEN: Implement to Make Tests Pass**

- [ ] **Task 1.3**: SuspenseFallback 컴포넌트 구현
  - File: `src/@common/components/SuspenseFallback/SuspenseFallback.tsx`
  - 기존 `Spinner` 컴포넌트(`src/@common/components/Spinner/Spinner.tsx`) 활용
  - `Flex` + `Spinner` 조합

- [ ] **Task 1.4**: ErrorBoundary 컴포넌트 구현
  - File: `src/@common/components/ErrorBoundary/ErrorBoundary.tsx`
  - Class component, `getDerivedStateFromError` + `componentDidCatch`
  - Props: `children`, `fallback`

**🔵 REFACTOR: Clean Up Code**

- [ ] **Task 1.5**: 코드 정리
  - 타입 분리 필요 시 `.types.ts` 파일 생성
  - export default 패턴 확인

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run test:run` — 100% passing
- [ ] `npm run lint` — no errors

**Manual Testing**:
- [ ] Storybook에서 SuspenseFallback 시각 확인 (선택)

**🔍 Frontend Code Review**:
- [ ] `/frontend-code-review src/@common/components/SuspenseFallback/`
- [ ] `/frontend-code-review src/@common/components/ErrorBoundary/`

---

### Phase 2: queryOptions 팩토리 + useSuspense 훅 생성 (전체 도메인)

**Goal**: 5개 도메인의 queryOptions 팩토리와 useSuspenseQuery 훅을 생성한다
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**

- [ ] **Test 2.1**: 각 useSuspense 훅이 useSuspenseQuery를 호출하는지 테스트
  - Files: 각 도메인의 queries 디렉토리에 테스트 추가
  - Expected: Tests FAIL (훅 미존재)

**🟢 GREEN: Implement to Make Tests Pass**

- [ ] **Task 2.2**: places 도메인 queryOptions + useSuspensePlaceListQuery
  - File: `src/domains/places/queries/usePlaceQuery.ts`
  - `queryOptions` import 추가
  - `placeListQueryOptions` 팩토리 생성 (queryKey + queryFn)
  - `useSuspensePlaceListQuery` 훅 생성
  - export에 추가

- [ ] **Task 2.3**: routie 도메인 queryOptions + useSuspenseRoutieQuery
  - File: `src/domains/routie/queries/useRoutieQuery.ts`
  - `routieQueryOptions` 팩토리 생성 (queryKey + queryFn + select)
  - `useSuspenseRoutieQuery` 훅 생성
  - export에 추가

- [ ] **Task 2.4**: routieSpace 도메인 queryOptions 2개 + useSuspense 훅 2개
  - File: `src/domains/routieSpace/queries/useRoutieSpaceQuery.ts`
  - `routieSpaceQueryOptions` (단일 스페이스 조회)
  - `routieSpaceListQueryOptions` (스페이스 목록 조회)
  - `useSuspenseRoutieSpaceQuery`, `useSuspenseGetRoutieSpaceListQuery`
  - export에 추가

- [ ] **Task 2.5**: auth 도메인 queryOptions + useSuspenseUserQuery
  - File: `src/domains/auth/queries/useAuthQuery.ts`
  - `userQueryOptions` 팩토리 생성
  - `useSuspenseUserQuery` 훅 생성
  - export에 추가

**🔵 REFACTOR: Clean Up Code**

- [ ] **Task 2.6**: 기존 useQuery 훅이 queryOptions 팩토리 재사용하도록 정리
  - `usePlaceListQuery` → `useQuery({ ...placeListQueryOptions, enabled })`
  - `useRoutieQuery` → `useQuery({ ...routieQueryOptions, enabled })` + `initialData` 제거
  - `useRoutieSpaceQuery` → `useQuery({ ...routieSpaceQueryOptions, enabled })`
  - `useUserQuery` → `useQuery({ ...userQueryOptions, enabled: Boolean(accessToken) })`

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run test:run` — 100% passing
- [ ] `npm run lint` — no errors
- [ ] `npm run build:prod` — 빌드 성공

**Manual Testing**:
- [ ] 기존 기능 정상 동작 확인 (이 Phase에서는 컴포넌트 미변경이므로 regression 없어야 함)

---

### Phase 3: 루티 스페이스 목록 Suspense 전환

**Goal**: ManageRoutieSpaces 페이지에 Suspense를 적용한다 (가장 단순한 케이스, SSE 없음)
**Status**: ⏳ Pending

#### Tasks

**🟢 GREEN: Implement**

- [ ] **Task 3.1**: ManageRoutieSpaces 페이지 수정
  - File: `src/pages/ManageRoutieSpaces/ManageRoutieSpaces.tsx`
  - `useGetRoutieSpaceListQuery()` → `useSuspenseGetRoutieSpaceListQuery()`
  - `isLoading` 분기 제거 (Suspense가 처리)
  - `error` 분기 제거 (ErrorBoundary가 처리)
  - `data: routieSpaces = []` → `data: routieSpaces` (항상 존재)

- [ ] **Task 3.2**: routes에 Suspense/ErrorBoundary 경계 추가
  - File: `src/routes/index.tsx`
  - `/manage-routie-spaces` 라우트에 `<ErrorBoundary>` + `<Suspense fallback={<SuspenseFallback />}>` 래핑
  - 에러 fallback으로 기존 에러 UI 유사 컴포넌트 제공

**🔵 REFACTOR: Clean Up Code**

- [ ] **Task 3.3**: 불필요한 import 정리

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run test:run` — 100% passing
- [ ] `npm run lint` — no errors

**Manual Testing**:
- [ ] `/manage-routie-spaces` 접속 → Suspense fallback(Spinner) 표시 → 스페이스 목록 로딩
- [ ] 네트워크 지연 시 Spinner 표시 확인
- [ ] 스페이스 생성/삭제 정상 동작

**🔍 Frontend Code Review**:
- [ ] `/frontend-code-review src/pages/ManageRoutieSpaces/`

---

### Phase 4: 루티 스페이스 이름 Suspense 전환 (SSE 기반)

**Goal**: useRoutieSpace 훅과 RoutieSpaceName에 Suspense를 적용하고, SSE 기반에서 REST 초기 fetch로 전환한다
**Status**: ⏳ Pending

#### Tasks

**🟢 GREEN: Implement**

- [ ] **Task 4.1**: useRoutieSpace 훅 수정
  - File: `src/domains/routieSpace/hooks/useRoutieSpace.ts`
  - `useRoutieSpaceQuery({ enabled: false })` → `useSuspenseRoutieSpaceQuery()`
  - `isLoading` 반환값 제거 (Suspense가 처리)
  - `routieSpace?.name` → `routieSpace.name` (non-nullable)
  - `UseRoutieSpaceReturn` 타입에서 `isLoading` 제거

- [ ] **Task 4.2**: RoutieSpaceName 컴포넌트 수정
  - File: `src/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName.tsx`
  - `isLoading` 사용처 제거 (저장 버튼 disabled 조건 조정)

- [ ] **Task 4.3**: RoutieSpace 페이지의 routieSpaceQuery 호출 수정
  - File: `src/pages/RoutieSpace/RoutieSpace.tsx`
  - 기존: `const { error: routieSpaceError } = useRoutieSpaceQuery()`
  - 변경: `useSuspenseRoutieSpaceQuery()`로 전환 → 에러는 ErrorBoundary에서 처리
  - routieSpaceError 기반 404 네비게이션 → ErrorBoundary fallback에서 처리하도록 이동
  - SSE 스트림(`useRoutieSpaceStream`)은 그대로 유지

**🔵 REFACTOR: Clean Up Code**

- [ ] **Task 4.4**: UseRoutieSpaceQueryOptions 타입 정리 (enabled 옵션 불필요 시)
  - File: `src/domains/routieSpace/types/useRoutieQuery.types.ts`

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run test:run` — 100% passing
- [ ] `npm run lint` — no errors

**Manual Testing**:
- [ ] `/routie-spaces?routieSpaceIdentifier=...` 접속 → Suspense fallback → 스페이스 이름 표시
- [ ] SSE 연결 후 다른 사용자가 이름 변경 시 실시간 반영
- [ ] 이름 수정 → 저장 정상 동작
- [ ] 존재하지 않는 UUID 접속 시 에러 처리 (not found 페이지)
- [ ] 깜빡임 없이 데이터 전환되는지 확인

**🔍 Frontend Code Review**:
- [ ] `/frontend-code-review src/domains/routieSpace/hooks/`
- [ ] `/frontend-code-review src/domains/routieSpace/components/RoutieSpaceName/`

---

### Phase 5: 장소 목록 + 루티 목록 Suspense 전환 (SSE 기반)

**Goal**: usePlaceList, useRoutieList 훅에 Suspense를 적용하고, SSE 기반에서 REST 초기 fetch로 전환한다
**Status**: ⏳ Pending

#### Tasks

**🟢 GREEN: Implement**

- [ ] **Task 5.1**: usePlaceList 훅 수정
  - File: `src/domains/places/hooks/usePlaceList.ts`
  - `usePlaceListQuery({ enabled: false })` → `useSuspensePlaceListQuery()`
  - `error` + `useEffect` 토스트 처리 제거 (ErrorBoundary가 처리)
  - `placeList`가 항상 존재 (non-nullable)

- [ ] **Task 5.2**: useRoutieList 훅 수정
  - File: `src/domains/routie/hooks/useRoutieList.ts`
  - `useRoutieQuery({ enabled: false })` → `useSuspenseRoutieQuery()`
  - `error` + `useEffect` 토스트 처리 제거
  - `routie.routiePlaces`가 항상 존재

- [ ] **Task 5.3**: useRoutieQuery의 initialData 제거
  - File: `src/domains/routie/queries/useRoutieQuery.ts`
  - `useRoutieQuery`에서 `initialData: { routiePlaces: [] }` 제거 (Suspense가 로딩 처리)

**🔵 REFACTOR: Clean Up Code**

- [ ] **Task 5.4**: UsePlaceListQueryOptions, UseRoutieQueryOptions 타입 정리

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run test:run` — 100% passing
- [ ] `npm run lint` — no errors

**Manual Testing**:
- [ ] `/routie-spaces?routieSpaceIdentifier=...` 접속 → 장소 목록, 루티 목록 정상 로딩
- [ ] SSE 연결 후 장소 추가/삭제/수정 실시간 반영
- [ ] 루티 순서 변경 실시간 반영
- [ ] 깜빡임 없이 SSE HISTORY 데이터 전환 확인

**🔍 Frontend Code Review**:
- [ ] `/frontend-code-review src/domains/places/hooks/`
- [ ] `/frontend-code-review src/domains/routie/hooks/`

---

### Phase 6: userId Suspense 전환 (조건부)

**Goal**: 로그인 보장 컨텍스트(ManageRoutieSpaceBanner, UserMenu)에서 useSuspenseUserQuery로 전환한다
**Status**: ⏳ Pending

#### Tasks

**🟢 GREEN: Implement**

- [ ] **Task 6.1**: ManageRoutieSpaceBanner 수정
  - File: `src/pages/ManageRoutieSpaces/components/ManageRoutieSpaceBanner/ManageRoutieSpaceBanner.tsx`
  - `useUserQuery()` → `useSuspenseUserQuery()`
  - `isLoading` 분기 제거
  - `user?.nickname` → `user.nickname` (non-nullable)
  - 이미 `RequireAccessToken` 가드 뒤에 있으므로 accessToken 보장됨

- [ ] **Task 6.2**: UserMenu 수정
  - File: `src/domains/auth/components/UserMenu/UserMenu.tsx`
  - `useUserQuery()` → `useSuspenseUserQuery()`
  - `isLoading`, `error` 분기 제거
  - `user?.nickname` → `user.nickname`
  - UserMenu는 `accessToken &&` 조건 뒤에서만 렌더링됨 (`RoutieSpace.tsx:84`)

- [ ] **Task 6.3**: Home.tsx, RoutieSpace.tsx의 useUserQuery는 유지
  - 비로그인 사용자도 접근하는 페이지 → `enabled: Boolean(accessToken)` 필요
  - 변경 없음 (확인만)

**🔵 REFACTOR: Clean Up Code**

- [ ] **Task 6.4**: import 정리

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run test:run` — 100% passing
- [ ] `npm run lint` — no errors

**Manual Testing**:
- [ ] `/manage-routie-spaces` → 배너에 닉네임 정상 표시 (Suspense fallback → 닉네임)
- [ ] RoutieSpace → UserMenu 클릭 → 닉네임 정상 표시
- [ ] Home 페이지 → 비로그인 상태에서 정상 접근
- [ ] Home 페이지 → 로그인 상태에서 정상 동작

**🔍 Frontend Code Review**:
- [ ] `/frontend-code-review src/pages/ManageRoutieSpaces/components/ManageRoutieSpaceBanner/`
- [ ] `/frontend-code-review src/domains/auth/components/UserMenu/`

---

### Phase 7: RoutieSpace 페이지 Suspense 경계 통합 + 문서 업데이트

**Goal**: RoutieSpace 라우트의 Suspense/ErrorBoundary 경계를 정리하고, 도메인 CLAUDE.md를 업데이트한다
**Status**: ⏳ Pending

#### Tasks

**🟢 GREEN: Implement**

- [ ] **Task 7.1**: RoutieSpace 라우트 Suspense/ErrorBoundary 정리
  - File: `src/routes/index.tsx`
  - 기존 `<Suspense fallback={<div>Loading...</div>}>` → `<ErrorBoundary>` + `<Suspense fallback={<SuspenseFallback />}>`
  - 코드 스플리팅 + 데이터 페칭 모두 커버

- [ ] **Task 7.2**: RoutieSpace 페이지의 수동 에러 처리 정리
  - File: `src/pages/RoutieSpace/RoutieSpace.tsx`
  - userQuery 에러 useEffect → 유지 (useQuery 그대로 사용)
  - routieSpaceError 기반 네비게이션 → Phase 4에서 이미 정리

- [ ] **Task 7.3**: 도메인 CLAUDE.md 업데이트
  - `src/domains/places/CLAUDE.md`: "초기 데이터 fetch는 기본적으로 비활성화" → "useSuspenseQuery로 REST 초기 fetch, SSE는 실시간 동기화"
  - `src/domains/routie/CLAUDE.md`: SSE SSOT 관련 문구에 Suspense 패턴 추가
  - `src/domains/routieSpace/CLAUDE.md`: Suspense 패턴 반영

**🔵 REFACTOR: Clean Up Code**

- [ ] **Task 7.4**: 전체 import 정리, 미사용 타입 제거

#### Quality Gate ✋

**Build & Tests**:
- [ ] `npm run test:run` — 100% passing
- [ ] `npm run lint` — no errors
- [ ] `npm run build:prod` — 빌드 성공

**Manual Testing (전체 통합)**:
- [ ] `/` (Home) — 비로그인/로그인 상태 정상 렌더링
- [ ] `/routie-spaces?routieSpaceIdentifier=...` — Suspense fallback → 데이터 로딩 → SSE 실시간 동기화
- [ ] `/manage-routie-spaces` — Suspense fallback → 스페이스 목록 로딩
- [ ] SSE 실시간 동기화: 다른 사용자 변경 시 반영
- [ ] 에러 케이스: 네트워크 끊김 시 ErrorBoundary 표시
- [ ] 존재하지 않는 routieSpace UUID 접속 시 에러 처리

**🔍 Frontend Code Review (최종)**:
- [ ] `/frontend-code-review src/routes/`
- [ ] `/frontend-code-review src/pages/RoutieSpace/`

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
- routes/index.tsx의 Suspense/ErrorBoundary 래핑 제거
- CLAUDE.md 원복

---

## 📊 Progress Tracking

### Completion Status

- **Phase 1**: ⏳ 0%
- **Phase 2**: ⏳ 0%
- **Phase 3**: ⏳ 0%
- **Phase 4**: ⏳ 0%
- **Phase 5**: ⏳ 0%
- **Phase 6**: ⏳ 0%
- **Phase 7**: ⏳ 0%

**Overall Progress**: 0% complete

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
| `src/routes/index.tsx` | 3,7 | Suspense/ErrorBoundary 경계 배치 |
| 도메인 CLAUDE.md 3개 | 7 | SSE + Suspense 패턴 문서 업데이트 |

---

## 📝 Notes & Learnings

### Implementation Notes

- (구현 중 추가)

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
**Next Action**: Phase 1 시작 (인프라 컴포넌트)
**Blocked By**: None
