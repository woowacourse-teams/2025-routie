import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ListWrapperStyle = css`
  overflow: hidden;

  width: 100%;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: ${theme.radius.sm};

  background-color: ${theme.colors.white};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
`;

const ListStyle = css`
  overflow-y: auto;
  max-height: 25rem;
`;

const ListItemStyle = css`
  width: 100%;
  padding: 1.2rem 1.6rem;
`;

export { ListWrapperStyle, ListStyle, ListItemStyle };
