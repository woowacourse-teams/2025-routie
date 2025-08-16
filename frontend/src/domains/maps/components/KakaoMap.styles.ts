import { css } from '@emotion/react';

export const KakaoMapWrapperStyle = css`
  position: relative;

  overflow: hidden;

  width: calc(100vw - 50rem);
  height: 100vh;
  margin: 0;
`;

export const KakaoMapContainerStyle = css`
  width: 100%;
  height: 100%;
`;

export const KakaoMapLoadingStyle = css`
  position: absolute;
  inset: 0;

  border-radius: 8px;

  color: #6c757d;

  background-color: #f8f9fa;
`;

export const KakaoMapErrorStyle = css`
  position: absolute;
  inset: 0;

  border-radius: 8px;

  color: #6c757d;

  background-color: #f8f9fa;
`;

export const MarkerLabelStyle = css`
  .marker-label {
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 3rem;
    height: 3rem;
    border-radius: 50%;

    font-size: 1.6rem;
    font-weight: bold;
    color: white;

    background: #2b6cb0;
  }
`;
