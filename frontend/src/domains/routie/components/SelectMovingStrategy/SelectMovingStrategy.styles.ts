import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const containerStyle = css`
  position: relative;
`;

export const backgroundSliderStyle = (
  selectedIndex: number,
  totalOptions: number,
) => css`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(${selectedIndex * 100}%);

  width: ${100 / totalOptions}%;
  height: 100%;
  border-radius: 8px;

  background-color: ${theme.colors.purple[200]};

  transition: transform 0.3s ease;
`;

export const movingStrategyIconWrapperStyle = css`
  cursor: pointer;

  position: relative;

  flex: 1;
  flex-shrink: 0;

  box-sizing: border-box;
  padding: 0.4rem;
`;

export const movingStrategyIconStyle = css`
  cursor: pointer;
`;
