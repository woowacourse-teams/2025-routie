import { css } from '@emotion/react';

export const CardStyle = css`
  min-width: 20rem;
  padding: 6rem 0;
  border-radius: 3rem;

  background-color: white;
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
`;

export const CircleStyle = (color: string) => css`
  overflow: hidden;

  border-radius: 50%;

  font-weight: bold;
  color: white;

  background-color: ${color};
`;
