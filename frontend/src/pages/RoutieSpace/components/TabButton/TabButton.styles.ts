import { css } from '@emotion/react';

import theme from '@/styles/theme';

import { TabButtonProps } from './TabButton.types';

const TabButtonStyle = ({ isActive }: Pick<TabButtonProps, 'isActive'>) => css`
  cursor: pointer;

  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 6rem;
  border: none;

  background-color: ${isActive ? theme.colors.blue[450] : theme.colors.white};

  &:hover {
    background-color: ${theme.colors.blue[200]};
  }
`;

export { TabButtonStyle };
