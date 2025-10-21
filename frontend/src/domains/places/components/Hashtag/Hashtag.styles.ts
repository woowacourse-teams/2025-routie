import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ButtonStyle = css`
  border: none;
  box-shadow: 0 0.2rem 0.8rem rgb(0 0 0 / 30%);
`;

const DeleteStyle = css`
  cursor: pointer;

  position: absolute;
  top: -0.6rem;
  right: -0.6rem;

  width: 2rem;
  height: 2rem;
  border-radius: 50%;

  background-color: ${theme.colors.white};
`;

export { ButtonStyle, DeleteStyle };
