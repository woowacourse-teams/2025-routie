import { css } from '@emotion/react';

import theme from '@/styles/theme';

export const SidebarSectionStyle = (overflow: boolean) => css`
  overflow: ${overflow ? 'hidden' : ''};
  border-radius: 8px;
  background-color: ${theme.home.gray};
  box-shadow: 0 0 1rem 0 rgb(0 0 0 / 20%);
`;

export const SidebarContainerStyle = css`
  overflow: hidden;
  padding-bottom: 1.6rem;
  border-right: 1px solid ${theme.colors.black};
`;

export const RoutieSectionScrollStyle = css`
  overflow-y: auto;
`;
