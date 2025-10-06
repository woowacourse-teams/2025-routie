import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ModalStyle = css`
  position: fixed;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 1.6rem;
  border-radius: ${theme.radius.sm};

  background-color: ${theme.colors.white};
`;

const ModalOverlayStyle = css`
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  opacity: 0.5;
  background-color: ${theme.colors.black};
`;

export { ModalStyle, ModalOverlayStyle };
