import { useState } from 'react';

import Icon from '@/@common/components/IconSvg/Icon';
import UserInfoCard from '@/domains/auth/components/UserInfoCard/UserInfoCard';

import {
  ProfileIconStyle,
  ProfileButtonWrapperStyle,
  ProfileButtonAbsoluteStyle,
  UserInfoCardStyle,
} from './ProfileButton.styles';

import type { ProfileButtonProps } from './ProfileButton.types';

const ProfileButton = ({
  onClick,
  userName,
  positioning = 'relative',
}: ProfileButtonProps) => {
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
      ? ProfileButtonAbsoluteStyle
      : ProfileButtonWrapperStyle;

  return (
    <div css={wrapperStyle}>
      <Icon
        name="user"
        size={40}
        css={ProfileIconStyle}
        onClick={handleProfileClick}
      />
      {isUserInfoOpen && userName && (
        <div css={UserInfoCardStyle}>
          <UserInfoCard userName={userName} onClick={handleLogout} />
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
