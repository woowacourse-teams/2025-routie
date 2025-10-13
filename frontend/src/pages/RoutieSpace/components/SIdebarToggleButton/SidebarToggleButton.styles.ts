import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ToggleButtonStyle = css`
  cursor: pointer;

  position: absolute;
  z-index: 1001;
  top: 50%;
  right: -2.4rem;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 3.6rem;
  height: 3.6rem;
  padding: 0;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: 50%;

  background-color: ${theme.colors.white};
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);

  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  }

  img {
    filter: invert(1);
  }
`;

const ToggleButtonIconStyle = (isOpen: boolean) => css`
  cursor: pointer;
  transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease-in-out;
`;

export { ToggleButtonStyle, ToggleButtonIconStyle };
