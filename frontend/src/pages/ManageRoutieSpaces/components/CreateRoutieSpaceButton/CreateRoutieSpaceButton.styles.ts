import { css } from '@emotion/react';

const CreateRoutieSpaceButtonStyle = css`
  max-width: 25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 8px 12px 0 rgb(0 0 0 / 20%);
  }

  @media (width <= 540px) {
    max-width: 100%;
  }
`;

const ButtonContentContainerStyle = css`
  @media (width <= 540px) {
    flex-direction: row;
    gap: 1rem;
    width: 100%;
    height: auto;
  }
`;

const ButtonIconSectionStyle = css`
  @media (width <= 540px) {
    width: 40px;
    height: 40px;
  }
`;

export {
  CreateRoutieSpaceButtonStyle,
  ButtonContentContainerStyle,
  ButtonIconSectionStyle,
};
