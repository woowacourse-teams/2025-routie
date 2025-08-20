import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';

import Flex from '@/@common/components/Flex/Flex';
import logoIcon from '@/assets/icons/logo.svg';

import headerStyle from './Header.style';
import HomeButton from './HomeButton/HomeButton';
import { buttonStyle } from './HomeButton/HomeButton.styles';

type HeaderProps = {
  isHome?: boolean;
} & PropsWithChildren;

const Header = ({ children, isHome }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div css={headerStyle}>
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
          css={buttonStyle}
          isHome={isHome}
        />
        {children}
      </Flex>
    </div>
  );
};

export default Header;
