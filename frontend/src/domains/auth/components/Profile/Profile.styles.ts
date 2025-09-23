import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ProfileIconStyle = css`
  cursor: pointer;

  padding: 0.4rem;
  border-radius: 50%;

  background-color: ${theme.colors.white};
  box-shadow: 0 4px 8px rgb(0 0 0 / 25%);
`;

export { ProfileIconStyle };
