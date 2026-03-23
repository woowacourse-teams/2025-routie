import { css } from '@emotion/react';

import { SIDEBAR_WIDTH_CLOSED } from '@/pages/RoutieSpace/components/Sidebar/width';
import theme from '@/styles/theme';

const RoutieSpaceSkeletonStyle = css`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: ${theme.colors.gray[50]};
`;

const SidebarSkeletonStyle = css`
  position: absolute;
  top: 1rem;
  bottom: 1rem;
  left: 1rem;
  width: ${SIDEBAR_WIDTH_CLOSED};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  box-shadow: 0 0 1rem 0 rgb(0 0 0 / 10%);
`;

export { RoutieSpaceSkeletonStyle, SidebarSkeletonStyle };
