import { css } from '@emotion/react';

export const ModalLayoutStyle = (width: string) => css`
  overflow-y: auto;
  width: ${width};
  max-width: 90vw;
  max-height: 90vh;
`;
