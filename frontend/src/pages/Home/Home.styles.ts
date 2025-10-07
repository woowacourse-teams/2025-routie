import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HomepageStyle = css`
  background-color: ${theme.home.gray};

  @media (width <= 970px) {
    height: auto;
  }
`;

const BlueTextStyle = css`
  font-size: inherit;
  color: ${theme.colors.blue[450]};
`;

const ButtonWrapperStyle = css`
  align-self: flex-start;
  justify-content: flex-start;
  width: auto;

  @media (width <= 970px) {
    flex-direction: column;
    gap: 2rem;
    max-width: 40rem;
  }
`;

const CreateButtonStyle = css`
  justify-content: center;
  max-width: 31rem;
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

const ContinueButtonStyle = css`
  justify-content: center;
  max-width: 31rem;
  background-color: ${theme.colors.white};
  box-shadow: 0 8px 16px rgb(0 0 0 / 16%);
`;

export {
  HomepageStyle,
  BlueTextStyle,
  ButtonWrapperStyle,
  CreateButtonStyle,
  ContinueButtonStyle,
};
