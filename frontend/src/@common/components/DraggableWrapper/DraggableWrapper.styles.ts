import { css } from '@emotion/react';

import theme from '@/styles/theme';

const DraggableWrapperStyle = css`
  cursor: grab;
  border-radius: ${theme.radius.sm};
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  &:hover {
    transform: translateY(-0.2rem);
    box-shadow: 0 0.8rem 2.4rem rgb(0 0 0 / 12%);
  }
`;

export { DraggableWrapperStyle };
