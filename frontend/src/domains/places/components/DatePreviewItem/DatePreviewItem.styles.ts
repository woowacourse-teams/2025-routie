import { css } from '@emotion/react';

import theme from '@/styles/theme';

const datePreviewItemStyle = (isChecked: boolean) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 2rem;
  height: 2rem;
  padding: 0.2rem;
  border-radius: 2rem;

  background-color: ${isChecked
    ? theme.colors.purple[300]
    : theme.colors.gray[200]};
`;

export default datePreviewItemStyle;
