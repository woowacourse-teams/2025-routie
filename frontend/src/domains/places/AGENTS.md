# AGENTS.md (domains/places)

## 목적
- places 도메인 변경 시 안전하고 일관된 적용을 위한 규칙

## 전역 규칙
- 프로젝트 전역 규칙은 전역 `AGENTS.md`를 따른다
- 이 문서는 places 도메인 특화 규칙만 정의한다

## 도메인 개요
- 책임: 장소 검색/목록·상세 조회/추가·삭제/좋아요/해시태그 관리 및 필터링/실시간 동기화(SSE)

## 폴더/파일 구조
- `adapters/`: 서버 응답 → UI 모델 변환 (`placeAdapter.ts`)
- `apis/`: 도메인 API 호출 (`place.ts`)
- `components/`: 도메인 공용 컴포넌트 (스토리 포함)
- `contexts/`: 도메인 내 여러 곳에서 공유되는 전역 상태 관리
- `hooks/`: 도메인 훅
- `queries/`: React Query hooks (`key.ts`에서 query key 관리)
- `types/`: 도메인 타입
- `utils/`: 도메인 유틸

## API/Adapter 규칙 (places 한정)
- 서버 응답이 추가될 때는 adapter를 반드시 추가
- 해시태그 요청 전 `removeHashtagPrefix`로 포맷 정리
- 해시태그 응답은 `addHashtagPrefix`로 표시 포맷 유지

## React Query 규칙
- query key 네이밍: `['places', ...]`
- query key는 `queries/key.ts`에서 정의
- 데이터 변환은 `select` 또는 adapter 사용
- mutation 성공 시 관련 query invalidate
- 장소 삭제 시 GA 이벤트 트리거가 필요하면 `usePlaceQuery.ts` 패턴 유지

## 도메인 정책 (places 한정)
- 해시태그 입력: 최대 5개, 최대 7자 제한
- 해시태그 필터 상태는 `sessionStorage`의 `selectedHashtags` 키로 유지
- 좋아요는 인증 필요하며, 토큰이 없으면 요청을 중단
- SSE 이벤트(PLACE_HISTORY/CREATED/UPDATED/DELETED)로 장소 목록 동기화
- 데이터 SSOT는 SSE이며, 초기 데이터 fetch는 기본적으로 비활성화하고 SSE 결과만 사용

## 변경 시 체크리스트
- 타입 먼저 추가 → API 연결 → adapter → hook → UI
- 불필요한 포맷팅 변경 금지
