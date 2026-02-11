/** @jsxImportSource @emotion/react */
import { Suspense, useState } from 'react';

import ErrorBoundary from '@/@common/components/ErrorBoundary/ErrorBoundary';
import Icon from '@/@common/components/IconSvg/Icon';
import { logout } from '@/@common/utils/logout';
import UserMenu from '@/domains/auth/components/UserMenu/UserMenu';

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
  const handleLogout = () => logout();

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
      {isUserInfoOpen && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <UserMenu onClick={handleLogout} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default UserMenuButton;
