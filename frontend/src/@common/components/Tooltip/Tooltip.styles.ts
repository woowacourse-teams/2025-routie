import { css } from '@emotion/react';

export const TooltipContainerStyle = css`
  position: relative;
  display: inline-block;
`;

export const TooltipStyle = css`
  position: absolute;
  z-index: 10;
  top: calc(100% + 0.8rem);
  transform: translateX(-50%);

  padding: 0.6rem 1.4rem;
  border: 0.1rem solid #bdbdbdff;
  border-radius: 1rem;

  color: #282828ff;
  white-space: nowrap;

  background-color: #ffff;
`;
