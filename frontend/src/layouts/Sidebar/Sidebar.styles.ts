import { css } from '@emotion/react';

import theme from '@/styles/theme';

const SidebarSectionStyle = (overflow: boolean) => css`
  overflow: ${overflow ? 'hidden' : ''};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
`;

const SidebarContainerStyle = css`
  position: absolute;
  z-index: 1000;
  top: 1rem;
  bottom: 1rem;
  left: 1rem;

  display: flex;
  flex-direction: column;
`;

const RoutieSectionScrollStyle = css`
  overflow-y: auto;
`;

export { SidebarSectionStyle, SidebarContainerStyle, RoutieSectionScrollStyle };
