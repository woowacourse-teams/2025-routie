import { css } from '@emotion/react';

import theme from '@/styles/theme';

const routieSpaceNameInputStyle = css`
  width: auto;
  margin: 0;
  padding: 0;
  border: none;

  font-size: ${theme.font.size.heading};
  font-weight: ${theme.font.weight.bold};
  color: ${theme.colors.purple[300]};

  &:focus {
    outline: none;
  }
`;

export default routieSpaceNameInputStyle;
