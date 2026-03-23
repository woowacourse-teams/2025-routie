/** @jsxImportSource @emotion/react */
import { Suspense, useState } from 'react';

import Button from '@/@common/components/Button/Button';
import ErrorBoundary from '@/@common/components/ErrorBoundary/ErrorBoundary';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { logout } from '@/@common/utils/logout';
import UserMenu from '@/domains/auth/components/UserMenu/UserMenu';
import { UserMenuStyle } from '@/domains/auth/components/UserMenu/UserMenu.styles';

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
        <ErrorBoundary
          fallbackRender={() => (
            <div css={UserMenuStyle}>
              <Flex direction="column" width="10" gap={1}>
                <Button onClick={handleLogout}>
                  <Flex gap={1}>
                    <Icon name="logout" size={16} />
                    <Text variant="caption" color="inherit">
                      로그아웃
                    </Text>
                  </Flex>
                </Button>
              </Flex>
            </div>
          )}
        >
          <Suspense fallback={null}>
            <UserMenu onClick={handleLogout} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default UserMenuButton;
