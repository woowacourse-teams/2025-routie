# routie 도메인

> 프로젝트 전역 규칙은 `/AGENTS.md` 참고

## 역할

사용자의 여행 일정 관리. 루티 스페이스 내 장소들을 일정에 추가하고 방문 순서(sequence)를 관리한다.

## 폴더 구조

```
src/domains/routie/
├── adapters/          # 서버 응답 → 클라이언트 타입 변환
├── apis/              # API 호출 함수
├── components/        # UI 컴포넌트
├── hooks/             # 비즈니스 로직 커스텀 훅
├── queries/           # React Query 훅 (useQuery, useMutation)
└── types/             # 타입 정의
```

## 다른 도메인과의 관계

- **routieSpace**: 모든 API가 routieSpace UUID 필요 (의존)
- **place**: placeId를 사용하여 장소를 일정에 추가 (의존)

## 도메인별 특수사항

### 1. 루티 스페이스 UUID 필수

- 모든 API 호출 전에 `getRoutieSpaceUuid()` + `ensureRoutieSpaceUuid()` 필수
- UUID 없으면 API 호출 불가

### 2. sequence는 0부터 시작

- 방문 순서는 0부터 시작하는 정수
- 순서 변경 시 주의

### 3. 인증 불필요

- routie 도메인의 모든 API는 인증이 필요 없음
- 루티 스페이스 UUID만 있으면 됨

### 4. SSE 기반 실시간 동기화

- 동선 상태는 SSE 메시지가 SSoT(Single Source of Truth)
- 초기 데이터는 useSuspenseQuery로 REST fetch 후 SSE로 실시간 동기화
- Suspense 경계: Sidebar 탭 콘텐츠 레벨에서 ErrorBoundary + Suspense로 래핑
- API mutation 후 응답을 사용하지 않고, SSE 이벤트로 상태 업데이트
- `useRoutieStream` 훅이 4가지 이벤트 수신:
  - `ROUTIE_HISTORY`: 전체 동선 히스토리
  - `ROUTIE_PLACE_CREATED`: 장소 추가 시
  - `ROUTIE_UPDATED`: 순서 변경 시
  - `ROUTIE_PLACE_DELETED`: 장소 삭제 시
- 모든 이벤트는 `replaceRoutie()`를 통해 React Query 캐시 직접 업데이트

## 새 기능 추가 순서

1. **타입 정의** → `types/api.types.ts`, `types/routie.types.ts`
2. **Adapter 작성** → `adapters/routieAdapter.ts`
3. **API 함수 작성** → `apis/routie.ts`
4. **Query 훅 작성** → `queries/useRoutieQuery.ts`

## 체크리스트

- [ ] `getRoutieSpaceUuid()` + `ensureRoutieSpaceUuid()` 호출 확인
- [ ] Adapter로 응답 변환 확인
- [ ] 에러 발생 시 `useToastContext`로 토스트 표시
- [ ] 에러 메시지 한글 확인
- [ ] `npm run lint` 실행

## 참고 파일

- API 호출 패턴: `src/domains/routie/apis/routie.ts`
- Adapter 패턴: `src/domains/routie/adapters/routieAdapter.ts`
- React Query 훅: `src/domains/routie/queries/useRoutieQuery.ts`
- 타입 정의: `src/domains/routie/types/`
