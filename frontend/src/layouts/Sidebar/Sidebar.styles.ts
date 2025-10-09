import { css } from '@emotion/react';

import theme from '@/styles/theme';

const SidebarSectionStyle = (overflow: boolean) => css`
  overflow: ${overflow ? 'hidden' : ''};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.home.gray};
  box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
`;

const SidebarContainerStyle = css`
  overflow: hidden;
  padding-bottom: 1.6rem;
  border-right: 1px solid ${theme.colors.black};
`;

const RoutieSectionScrollStyle = css`
  overflow-y: auto;
`;

export { SidebarSectionStyle, SidebarContainerStyle, RoutieSectionScrollStyle };
