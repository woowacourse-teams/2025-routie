import { css } from '@emotion/react';

import theme from '@/styles/theme';

const DefaultBorder = css`
  &:focus {
    outline: 0.3rem solid ${theme.colors.blue[450]};
  }
`;

const InvalidBorder = css`
  &:focus {
    outline: 0.3rem solid ${theme.colors.red[100]};
  }
`;

const RoutieSpaceNameInputStyle = (invalidNameLength: boolean) => css`
  width: 100%;
  max-width: 41rem;
  margin: 0;
  padding: 0.4rem;
  border: none;
  border-radius: ${theme.radius.sm};

  font-size: ${theme.font.size.subHeading};
  font-weight: ${theme.font.weight.semibold};

  background-color: inherit;

  ${invalidNameLength ? InvalidBorder : DefaultBorder}
`;

export { RoutieSpaceNameInputStyle };
