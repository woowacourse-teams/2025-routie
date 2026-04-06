import { css } from '@emotion/react';

import theme from '@/styles/theme';

const SectionErrorFallbackStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 2rem;
  width: 100%;
  height: 100%;
  color: ${theme.colors.gray[200]};
  font-size: ${theme.font.size.caption};
`;

const RetryButtonStyle = css`
  padding: 0.6rem 1.2rem;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.gray[250]};
  font-size: ${theme.font.size.caption};
  cursor: pointer;

  &:hover {
    background: ${theme.colors.gray[50]};
  }
`;

export { SectionErrorFallbackStyle, RetryButtonStyle };
