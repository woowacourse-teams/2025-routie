# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

Routie는 React 19 + TypeScript 기반 SPA입니다. Webpack 번들러, React Query(상태/데이터), React Router(라우팅), Emotion(CSS-in-JS)을 사용합니다.

## 명령어

```bash
npm run start          # 개발 서버 (포트 3000)
npm run build:prod     # 프로덕션 빌드
npm run test           # 테스트 실행 (watch 모드)
npm run test:run       # 테스트 1회 실행
npm run lint           # ESLint 자동 수정
npm run storybook      # Storybook 개발 서버 (포트 6006)
```

## 아키텍처

### 디렉터리 구조
- `src/@common/` - 공통 컴포넌트, 훅, 컨텍스트, 유틸리티
- `src/apis/` - 공통 API 클라이언트 (`apiClient` from `src/apis/index.ts`)
- `src/domains/` - 도메인별 기능 모듈 (apis/adapters/types)
- `src/pages/` - 페이지 컴포넌트
- `src/routes/` - 라우트 정의 및 Provider 설정
- `src/mocks/` - MSW 설정

### 경로 별칭
`@/*` → `src/*`

### API 패턴
`fetch` 직접 호출 대신 `src/apis/index.ts`의 `apiClient` 사용. 도메인별 API는 `src/domains/<domain>/apis/`에 위치. 서버 응답은 `src/domains/<domain>/adapters/`에서 변환.

### Provider 계층 (src/routes/index.tsx)
QueryClientProvider → ModalProvider → ToastProvider → RouterProvider

### 인증 패턴
- `getAccessTokenOrThrow` - API 호출용 토큰 획득
- `getRoutieSpaceUuid` / `ensureRoutieSpaceUuid` - Routie Space 보호
- `RequireAccessToken` - 라우트 가드 컴포넌트

## 코드 컨벤션

### 파일 구조
- 컴포넌트와 스타일: `SomeComponent/SomeComponent.tsx` + `SomeComponent.styles.ts`
- 타입은 `*.types.ts` 파일로 분리: `api.types.ts` (요청/응답), `{domain}.types.ts` (클라이언트)

### 네이밍
- 폴더: 복수형 (components, utils, hooks)
- 컴포넌트: PascalCase
- 변수/함수: camelCase
- 상수: SCREAMING_SNAKE_CASE
- 불린: `is`/`can`/`has` 접두사
- props 이벤트 핸들러: `on` 접두사, 내부 핸들러: `handle` 접두사

### TypeScript
- 객체는 `interface`, 나머지는 `type` (Pick/Omit 포함)
- 접미사: `Props` (컴포넌트), `Type` (일반), `Params` (함수), `Request`/`Response` (API)
- 타입 export/import는 `export type`, `import type` 사용

### Export
- 컴포넌트, Context: `export default`
- 유틸리티: named export, 모아서 내보내기 (개별 함수 export 금지)

## 환경 변수

`.env.dev` / `.env.prod` 필수 키:
- `REACT_APP_API_URL`
- `REACT_APP_GA4_MEASUREMENT_ID`
- `REACT_APP_SENTRY_DSN`

## 변경 후

커밋 전 `npm run lint` 실행.
