import { css } from '@emotion/react';

import theme from '@/styles/theme';

const SidebarContainerStyle = css`
  position: absolute;
  z-index: 1000;
  top: 1rem;
  bottom: 1rem;
  left: 1rem;

  display: flex;
  flex-direction: column;

  width: 55rem;
  border-radius: ${theme.radius.sm};

  background-color: ${theme.colors.white};
  box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
`;

export { SidebarContainerStyle };
