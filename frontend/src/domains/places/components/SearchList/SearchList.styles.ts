import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ListStyle = css`
  overflow-y: auto;

  width: 90%;
  max-height: 20rem;
  border: 1px solid ${theme.colors.gray[50]};
  border-radius: ${theme.radius.sm};

  background-color: ${theme.colors.white};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
`;

/**
 * 이름 수정 필요 -> listItem
 * padding px -> rem 수정
 */
const ItemButtonStyle = css`
  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-radius: 0;
`;

export { ListStyle, ItemButtonStyle };
