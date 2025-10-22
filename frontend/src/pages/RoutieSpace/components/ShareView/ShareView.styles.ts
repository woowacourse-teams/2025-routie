import { css } from '@emotion/react';

import theme from '@/styles/theme';

const LinkShareContainerStyle = css`
  overflow: hidden;
  border-radius: ${theme.radius.sm};
`;

const LinkInputAreaStyle = css`
  border: 1px solid ${theme.colors.gray[100]};
  border-right: none;
  border-radius: ${theme.radius.sm} 0 0 ${theme.radius.sm};
`;

const LinkCopyButtonStyle = (isCopied: boolean) => css`
  cursor: pointer;

  width: 15%;
  height: 3rem;
  border: none;
  border-radius: 0 ${theme.radius.sm} ${theme.radius.sm} 0;

  background-color: ${isCopied
    ? theme.colors.green[100]
    : theme.colors.blue[450]};
`;

export { LinkShareContainerStyle, LinkInputAreaStyle, LinkCopyButtonStyle };
