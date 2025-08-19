import { css } from '@emotion/react';

import theme from '@/styles/theme';

const defaultBorder = css`
  &:focus {
    outline: 0.3rem solid ${theme.colors.purple[300]};
  }
`;

const invalidBorder = css`
  &:focus {
    outline: 0.3rem solid ${theme.colors.red[100]};
  }
`;

const routieSpaceNameInputStyle = (invalidNameLength: boolean) => css`
  width: 100%;
  max-width: 38rem;
  margin: 0;
  padding: 0.4rem;
  border: none;
  border-radius: 8px;

  font-size: ${theme.font.size.heading};
  font-weight: ${theme.font.weight.bold};

  ${invalidNameLength ? invalidBorder : defaultBorder}
`;

export default routieSpaceNameInputStyle;
