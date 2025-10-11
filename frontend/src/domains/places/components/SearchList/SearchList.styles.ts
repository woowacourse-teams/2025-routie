import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ListStyle = css`
  overflow-y: auto;

  width: 100%;
  max-height: 20rem;
  border: 1px solid ${theme.colors.gray[50]};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  background-color: ${theme.colors.white};
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
