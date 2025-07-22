import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const toggleSwitchContainer = css`
  display: inline-block;
`;

export const hiddenCheckbox = css`
  display: none;
`;

export const toggleStyle = (checked: boolean) => css`
  cursor: pointer;

  position: relative;

  display: inline-block;

  width: 32px;
  height: 14px;
  border-radius: 34px;

  background-color: ${checked
    ? theme.colors.purple[400]
    : theme.colors.gray[50]};

  transition: background-color 0.2s ease;

  &::after {
    content: '';

    position: absolute;
    top: 1px; /* 중앙 배치 (상하 마진 1px 유지) */
    left: ${checked ? 'calc(100% - 14px)' : '1px'};

    width: 12px; /* 14px → 12px로 변경 */
    height: 12px; /* 14px → 12px로 변경 */
    border-radius: 50%;

    background-color: ${theme.colors.white};

    transition: left 0.2s ease;
  }
`;
