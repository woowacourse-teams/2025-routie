import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HashtagButtonContainerStyle = (isSidebarOpen: boolean) => css`
  scrollbar-width: none;

  position: absolute;
  z-index: 10;
  top: 1.6rem;
  right: 1.6rem;
  left: ${isSidebarOpen ? 'calc(55rem + 1.6rem)' : 'calc(5.5rem + 1.6rem)'};

  overflow: auto hidden;
  flex-wrap: nowrap;

  padding-bottom: 0.8rem;

  transition: left 0.3s ease-in-out;

  &::-webkit-scrollbar {
    height: 0;
  }
`;

const KakaoMapWrapperStyle = css`
  position: relative;

  overflow: hidden;

  width: 100vw;
  height: 100vh;
  margin: 0;
`;

const KakaoMapContainerStyle = css`
  width: 100%;
  height: 100%;
`;

const KakaoMapLoadingStyle = css`
  position: absolute;
  inset: 0;

  border-radius: ${theme.radius.sm};

  color: #6c757d;

  background-color: #f8f9fa;
`;

const KakaoMapErrorStyle = css`
  position: absolute;
  inset: 0;

  border-radius: ${theme.radius.sm};

  color: #6c757d;

  background-color: #f8f9fa;
`;

export {
  HashtagButtonContainerStyle,
  KakaoMapWrapperStyle,
  KakaoMapContainerStyle,
  KakaoMapLoadingStyle,
  KakaoMapErrorStyle,
};
