/** @jsxImportSource @emotion/react */
import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import HomeButton from '@/@common/components/HomeButton/HomeButton';
import Text from '@/@common/components/Text/Text';
import UserMenuButton from '@/domains/auth/components/UserMenuButton/UserMenuButton';
import theme from '@/styles/theme';

import { HeaderStyle, HomeButtonStyle } from './Header.style';

import type { HeaderProps } from './Header.types';

const Header = ({ isLoggedIn, onLoginClick, onLogoClick }: HeaderProps) => {
  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <div css={HeaderStyle}>
      <Flex
        gap={1}
        height="100%"
        justifyContent="space-between"
        padding="0 1.6rem"
      >
        <HomeButton onClick={onLogoClick} css={HomeButtonStyle} />
        {isLoggedIn ? (
          <UserMenuButton />
        ) : (
          <Button
            variant="primary"
            width="10rem"
            onClick={handleLoginClick}
            padding="0.6rem"
          >
            <Text color={theme.colors.white} variant="body">
              로그인
            </Text>
          </Button>
        )}
      </Flex>
    </div>
  );
};

export default Header;
