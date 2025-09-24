import { useState } from 'react';

import Icon from '@/@common/components/IconSvg/Icon';
import UserMenu from '@/domains/auth/components/UserMenu/UserMenu';

import {
  UserMenuIconStyle,
  UserMenuButtonWrapperStyle,
  UserMenuButtonAbsoluteStyle,
} from './UserMenuButton.styles';

import type { UserMenuButtonProps } from './UserMenuButton.types';

const UserMenuButton = ({
  onClick,
  userName,
  positioning = 'absolute',
}: UserMenuButtonProps) => {
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const handleProfileClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsUserInfoOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    alert('로그아웃 버튼 클릭됨!');
  };

  const wrapperStyle =
    positioning === 'absolute'
      ? UserMenuButtonAbsoluteStyle
      : UserMenuButtonWrapperStyle;

  return (
    <div css={wrapperStyle}>
      <Icon
        name="user"
        size={40}
        css={UserMenuIconStyle}
        onClick={handleProfileClick}
      />
      {isUserInfoOpen && userName && (
        <UserMenu userName={userName} onClick={handleLogout} />
      )}
    </div>
  );
};

export default UserMenuButton;
