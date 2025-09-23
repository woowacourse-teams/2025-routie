import { css } from '@emotion/react';

const KakaoMapWrapperStyle = css`
  position: relative;

  overflow: hidden;

  width: calc(100vw - 50rem);
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

  border-radius: 8px;

  color: #6c757d;

  background-color: #f8f9fa;
`;

const KakaoMapErrorStyle = css`
  position: absolute;
  inset: 0;

  border-radius: 8px;

  color: #6c757d;

  background-color: #f8f9fa;
`;

const kakaoMapProfileStyle = css`
  position: absolute;
  z-index: 10;
  top: 16px;
  right: 20px;
`;
const kakaoMapUserInfoStyle = css`
  position: absolute;
  z-index: 10;
  top: 60px;
  right: 20px;
`;

export {
  KakaoMapWrapperStyle,
  KakaoMapContainerStyle,
  KakaoMapLoadingStyle,
  KakaoMapErrorStyle,
  kakaoMapProfileStyle,
  kakaoMapUserInfoStyle,
};
