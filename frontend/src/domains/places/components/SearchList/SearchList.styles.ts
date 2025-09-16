import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ListStyle = css`
  overflow-y: auto;

  width: 100%;
  max-height: 20rem;
  border: 1px solid ${theme.colors.gray[50]};

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

const ItemEmptyStyle = css`
  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-radius: 0;
`;

export { ListStyle, ItemButtonStyle, ItemEmptyStyle };
