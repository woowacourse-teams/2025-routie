import { css } from '@emotion/react';

const PhoneContainerStyle = css`
  position: relative;
  aspect-ratio: 9 / 19.5;
  width: min(38vw, 32rem);
`;

const ScreenBoxStyle = css`
  position: absolute;
  inset: 3.5% 2.5%;
  overflow: hidden;
  border-radius: 3.5rem;
`;

const ChatScrollStyle = css`
  scrollbar-width: none;
  overflow: hidden auto;
  width: 100%;
  height: 100%;
`;

const ChatImageStyle = css`
  display: block;
  width: 100%;
  height: auto;
`;

const FrameOverlayStyle = css`
  pointer-events: none;

  position: absolute;
  z-index: 2;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;
`;

export {
  PhoneContainerStyle,
  ScreenBoxStyle,
  ChatScrollStyle,
  ChatImageStyle,
  FrameOverlayStyle,
};
