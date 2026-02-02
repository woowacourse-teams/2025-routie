# AGENTS.md

## 목적

- Routie 프론트엔드 코드베이스에 신규 변경을 안전하고 일관되게 적용하기 위한 규칙과 맥락을 제공합니다.

## 프로젝트 개요

- React 19 + TypeScript 기반 SPA
- 번들러: Webpack (dev/prod 분리)
- 상태/데이터: React Query 사용
- 라우팅: React Router
- 스타일: Emotion

## 디렉터리 구조 개요

- `src/@common`: 공통 컴포넌트/유틸/상수
- `src/apis`: 공통 API 클라이언트 (`src/apis/index.ts`)
- `src/domains`: 도메인별 기능 모듈 (apis/adapters/types 등)
- `src/pages`: 페이지 단위 UI
- `src/routes`: 라우팅 구성
- `src/styles`: 전역/공통 스타일
- `src/mocks`: MSW 관련
- `src/libs`: 공용 라이브러리 래퍼
- `src/types`: 전역 타입

## 경로 별칭

- `@/*` → `src/*` (tsconfig paths)

## 폴더 및 파일 구조

- 폴더명은 복수형 사용 (`utils, components, types, styles, queries`)
- 컴포넌트 내부 폴더/파일은 PascalCase 사용
- 유틸, 훅, 스타일 등은 camelCase 사용

## 파일 컨벤션

- 컴포넌트는 스타일 파일과 컴포넌트 파일을 묶어 하나의 폴더로 관리한다
  - `SomeComponent/SomeComponent.styles.ts, SomeComponent.tsx`

## 타입 컨벤션

### 타입 코드의 위치

- 모든 타입 코드는 `types` 폴더로 이동
- 컴포넌트에서만 사용한다면 같은 폴더 안에 별도 파일로
- 다른 곳에서도 사용한다면, 도메인 폴더 바로 하위 `types` 폴더로 이동
- api type & client type 파일 분리
  - api type은 request type과 response type을 분리한다

### 파일 이름

- `***.types.ts`
- 클라이언트 타입 파일 이름: `{domain name}.types.ts`
- api 타입 파일 이름: `api.types.ts`

### type export 사용하기

- `export type { SomeThing };`

### type import 사용하기

- `import type { SomeThing };`

### type & interface

- 객체는 interface
- 나머지는 type
- Pick이나 Omit 사용할때는 type

### 접미사

- 컴포넌트에 사용하는 것은 `Props` 붙이기
- 나머지는 `Type`
- 함수는 `Params`
- 스타일 Props는 `StyleProps` 붙이기
- context 사용할 때도 `Props` 붙이기
- api: `Request`, `Response`

### 파스칼 케이스

- 타입은 무조건 파스칼 케이스

## 코드 컨벤션

- 컴포넌트, Context는 export default 나머지는 그냥 export를 사용한다
  - 모아서 내보내기를 사용한다(개별 함수 export 사용 금지)

## 변수 & 함수명

- 변수명은 camelCase 사용
- 함수는 가급적 동사 접두사 사용
- 불린 변수는 `is`, `can`, `has` 접두사 사용
- 배열 변수는 복수형 또는 `List` 접미사 사용
- 상수는 `SCREAMING_SNAKE_CASE` 사용
- 객체 형태의 상수도 `SCREAMING_SNAKE_CASE` 사용

## 함수 네이밍

- 반환 값이 불린인 함수는 `is`, `can`, `has` 접두사 사용
- 무언가를 생성하는 함수는 `create` 접두사 사용
- 특정 값을 가져오는 함수는 `get` 접두사 사용
- props로 전달하는 이벤트 핸들러 함수는 `on` 접두사 사용
- 컴포넌트 내부 이벤트 핸들러 함수는 `handle` 접두사 사용
- 배열 메서드로 반환하는 값은 메서드 이름 포함
- 배열을 변환해 반환하는 함수는 `convert` 접두사 사용

## 리액트

- React 타입은 `React.` 접두어 없이 개별 import 사용
- context 객체 이름에는 `Context` 접미사 사용
- context를 사용하는 커스텀 훅에는 `Context` 접미사 사용
- children을 반환하는 provider 컴포넌트에는 `Provider` 접미사 사용

## API 호출 규칙

- 공통 API 호출은 `apiClient` 사용 (`src/apis/index.ts`)
- 에러 처리 로직은 `handleApiError`를 통해 일관되게 처리
- 도메인별 API는 `src/domains/<domain>/apis`에 위치
- 서버 응답은 필요 시 adapter로 변환 (`src/domains/<domain>/adapters`)
- 인증 필요 API는 `getAccessTokenOrThrow`를 통해 토큰 확보
- Routie Space 기반 API는 `getRoutieSpaceUuid` / `ensureRoutieSpaceUuid`로 보호

## 환경 변수

- `.env.dev`, `.env.prod` 참고
- 필수 키: `REACT_APP_API_URL`, `REACT_APP_GA4_MEASUREMENT_ID`, `REACT_APP_SENTRY_DSN`

## 실행/빌드 명령어

- 개발 서버: `npm run start`
- 개발 빌드: `npm run build:dev`
- 프로덕션 빌드: `npm run build:prod`
- 테스트: `npm run test` / `npm run test:run`
- 스토리북: `npm run storybook` / `npm run build-storybook`
- 린트: `npm run lint`

## 변경 시 유의사항

- 기존 도메인 구조와 네이밍 패턴을 유지
- 직접 `fetch` 호출 대신 `apiClient` 재사용
- 타입 정의를 먼저 추가/정리하고 로직을 연결
- 리팩터링은 변경 범위를 최소화하고, 불필요한 포맷팅 변경을 피함

## 작업 후

- 수정이 끝나면 lint를 적용한다
