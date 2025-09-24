import { css } from '@emotion/react';

import theme from '@/styles/theme';

const LoginModalStyle = css`
  padding: 2rem 1rem;
  text-align: center;
`;

const DividerStyle = css`
  flex: 1;
  height: 1px;
  background-color: ${theme.colors.gray[50]};
`;

const KakaoButtonStyle = css`
  cursor: pointer;

  width: fit-content;
  height: fit-content;
  border: none;

  background-color: transparent;
`;

export { KakaoButtonStyle, DividerStyle, LoginModalStyle };
