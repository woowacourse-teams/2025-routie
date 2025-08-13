import { css } from '@emotion/react';

export const TooltipContainerStyle = css`
  position: relative;
  display: inline-block;
`;

export const TooltipStyle = css`
  position: absolute;
  z-index: 10;
  top: 100%;
  transform: translateX(-50%);

  padding: 6px 14px;
  border: 0.1rem solid #bdbdbdff;
  border-radius: 10px;

  color: #282828ff;
  white-space: nowrap;

  background-color: #ffff;
`;
