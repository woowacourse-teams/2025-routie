import { css } from '@emotion/react';

import theme from '@/styles/theme';

const PillStyle = css`
  display: flex;
  gap: 0.8rem;
  align-items: center;

  width: max-content;
  padding: 0.3rem;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: 0.8rem;

  color: ${theme.colors.blue[450]};

  background-color: ${theme.colors.white};
`;

export { PillStyle };
