import { useNavigate } from 'react-router';

import Flex from '@/@common/components/Flex/Flex';
import logoIcon from '@/assets/icons/logo.svg';

import HomeButton from '../HomeButton/HomeButton';

import { HeaderStyle, HomeButtonStyle } from './Header.style';

import type { HeaderProps } from './Header.types';

const Header = ({ children, isHome }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div css={HeaderStyle}>
      <Flex
        direction="row"
        gap={1}
        height="100%"
        justifyContent="space-between"
        padding={1}
      >
        <HomeButton
          icon={logoIcon}
          onClick={() => navigate('/')}
          css={HomeButtonStyle}
          isHome={isHome}
        />
        {children}
      </Flex>
    </div>
  );
};

export default Header;
