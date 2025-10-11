/** @jsxImportSource @emotion/react */
import { useState } from 'react';

import Icon from '@/@common/components/IconSvg/Icon';
import UserMenu from '@/domains/auth/components/UserMenu/UserMenu';
import { useLogout } from '@/domains/auth/hooks/useLogout';

import {
  UserMenuIconStyle,
  UserMenuButtonWrapperStyle,
  UserMenuButtonAbsoluteStyle,
} from './UserMenuButton.styles';

import type { UserMenuButtonProps } from './UserMenuButton.types';

const UserMenuButton = ({
  onClick,
  positioning = 'absolute',
}: UserMenuButtonProps) => {
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const { handleLogout } = useLogout();

  const handleProfileClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsUserInfoOpen((prev) => !prev);
    }
  };

  const wrapperStyle =
    positioning === 'absolute'
      ? UserMenuButtonAbsoluteStyle
      : UserMenuButtonWrapperStyle;

  return (
    <div css={wrapperStyle}>
      <Icon
        name="menu"
        size={40}
        css={UserMenuIconStyle}
        onClick={handleProfileClick}
      />
      {isUserInfoOpen && <UserMenu onClick={handleLogout} />}
    </div>
  );
};

export default UserMenuButton;
