import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ProfileIconStyle = css`
  cursor: pointer;

  padding: 0.4rem;
  border-radius: 50%;

  background-color: ${theme.colors.white};
  box-shadow: 0 4px 8px rgb(0 0 0 / 25%);
`;

const ProfileButtonWrapperStyle = css`
  position: relative;
  display: inline-block;
`;

const ProfileButtonAbsoluteStyle = css`
  position: absolute;
  z-index: 10;
  top: 16px;
  right: 20px;
`;

const UserInfoCardStyle = css`
  position: absolute;
  z-index: 10;
  top: 44px;
  right: 0;
`;

const ProfileButtonStyle = css`
  cursor: pointer;
  width: fit-content;
  background-color: ${theme.colors.white};
`;

export { ProfileIconStyle, ProfileButtonWrapperStyle, ProfileButtonAbsoluteStyle, UserInfoCardStyle, ProfileButtonStyle };
