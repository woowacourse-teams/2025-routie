import { css } from '@emotion/react';

import theme from '@/styles/theme';

const routieSpaceNameInputStyle = css`
  width: 100%;
  margin: 0;
  padding: 0.4rem;
  border: none;

  font-size: ${theme.font.size.heading};
  font-weight: ${theme.font.weight.bold};

  &:focus {
    border-radius: 8px;
    outline: 0.3rem solid ${theme.colors.purple[300]};
  }
`;

export default routieSpaceNameInputStyle;
