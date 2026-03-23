# routieSpace 도메인

> 프로젝트 전역 규칙은 `/AGENTS.md` 참고

## 역할

여행 계획을 담는 워크스페이스. 여러 장소(Place)와 하나의 루티(Routie)를 포함한다.
UUID로 식별되며, URL 쿼리 파라미터 `name`으로 관리된다.

## 폴더 구조

```
src/domains/routieSpace/
├── adapters/          # 서버 응답 → 클라이언트 타입 변환
├── apis/              # API 호출 함수
├── components/        # UI 컴포넌트
├── constants/         # 도메인 상수
├── hooks/             # 비즈니스 로직 커스텀 훅
├── queries/           # React Query 훅 (useQuery, useMutation)
└── types/             # 타입 정의
```

## 다른 도메인과의 관계

- **모든 도메인의 기반**: place, routie 등 모든 도메인이 routieSpace UUID를 필요로 함
- 다른 도메인에서 `getRoutieSpaceUuid()` + `ensureRoutieSpaceUuid()`로 UUID 확보

## 도메인별 특수사항

### 1. 인증 필요/불필요 API 구분

| 작업      | 인증 필요 |
| --------- | --------- |
| 생성      | ✅        |
| 조회      | ❌        |
| 이름 수정 | ✅        |
| 목록 조회 | ✅        |
| 삭제      | ✅        |

- **인증 필요**: `getAccessTokenOrThrow()` + Authorization 헤더
- **인증 불필요**: `getRoutieSpaceUuid()` + `ensureRoutieSpaceUuid()`

### 3. Suspense 패턴

- routieSpace 조회: useSuspenseQuery로 라우트 레벨 Suspense에서 처리
- routieSpace 목록: useSuspenseQuery로 라우트 레벨 Suspense에서 처리
- 각 라우트에 ErrorBoundary(fallbackRender) + Suspense 경계 배치

### 2. identifier → routieSpaceUuid 변환 필수

- 서버: `identifier` 사용
- 클라이언트: `routieSpaceUuid` 사용
- Adapter에서 반드시 변환

### 4. UUID는 URL 쿼리 파라미터 name으로 관리

```
https://routie.com/?name={uuid}
```

- 루티 스페이스 생성 후 `navigate(\`/?name=${routieSpaceUuid}\`)` 필수

## 새 기능 추가 순서

1. **타입 정의** → `types/api.types.ts`, `types/routieSpace.types.ts`
2. **Adapter 작성** → `adapters/routieSpaceAdapter.ts` (identifier 변환)
3. **API 함수 작성** → `apis/routieSpace.ts` (인증 여부 확인)
4. **Query 훅 작성** → `queries/useRoutieSpaceQuery.ts`

## 체크리스트

- [ ] 인증 필요 여부 확인 (API마다 다름)
- [ ] 인증 필요 시 `getAccessTokenOrThrow()` + Authorization 헤더
- [ ] 인증 불필요 시 `getRoutieSpaceUuid()` + `ensureRoutieSpaceUuid()`
- [ ] Adapter에서 `identifier` → `routieSpaceUuid` 변환
- [ ] 에러 발생 시 `useToastContext`로 토스트 표시
- [ ] 에러 메시지 한글 확인
- [ ] `npm run lint` 실행

## 참고 파일

- API 호출 패턴 (인증/비인증): `src/domains/routieSpace/apis/routieSpace.ts`
- Adapter 패턴 (identifier 변환): `src/domains/routieSpace/adapters/routieSpaceAdapter.ts`
- React Query 훅: `src/domains/routieSpace/queries/useRoutieSpaceQuery.ts`
- 타입 정의: `src/domains/routieSpace/types/`
