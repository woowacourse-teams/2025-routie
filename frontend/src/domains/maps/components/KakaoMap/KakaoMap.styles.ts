import { css } from '@emotion/react';

import theme from '@/styles/theme';

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
  KakaoMapWrapperStyle,
  KakaoMapContainerStyle,
  KakaoMapLoadingStyle,
  KakaoMapErrorStyle,
};
