/** @jsxImportSource @emotion/react */
import { Suspense } from 'react';

import Button from '@/@common/components/Button/Button';
import ErrorBoundary from '@/@common/components/ErrorBoundary/ErrorBoundary';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { logout } from '@/@common/utils/logout';
import UserMenu from '@/domains/auth/components/UserMenu/UserMenu';
import { UserMenuStyle } from '@/domains/auth/components/UserMenu/UserMenu.styles';
import { useUserMenuVisibility } from '@/domains/auth/hooks/useUserMenuVisibility';

import {
  UserMenuIconStyle,
  UserMenuTriggerButtonStyle,
  UserMenuButtonWrapperStyle,
  UserMenuButtonAbsoluteStyle,
} from './UserMenuButton.styles';

import type { UserMenuButtonProps } from './UserMenuButton.types';

const UserMenuButton = ({
  onClick,
  positioning = 'absolute',
}: UserMenuButtonProps) => {
  const {
    isUserMenuOpen,
    userMenuRef,
    userMenuTriggerButtonRef,
    toggleUserMenu,
  } = useUserMenuVisibility();
  const handleLogout = () => logout();

  const handleProfileClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggleUserMenu();
    }
  };

  const wrapperStyle =
    positioning === 'absolute'
      ? UserMenuButtonAbsoluteStyle
      : UserMenuButtonWrapperStyle;

  return (
    <div css={wrapperStyle} ref={userMenuRef}>
      <button
        type="button"
        ref={userMenuTriggerButtonRef}
        css={UserMenuTriggerButtonStyle}
        onClick={handleProfileClick}
        aria-label="사용자 메뉴 열기"
        aria-haspopup="menu"
        aria-controls="userMenu"
        aria-expanded={isUserMenuOpen}
      >
        <Icon name="menu" size={40} css={UserMenuIconStyle} />
      </button>
      {isUserMenuOpen && (
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
