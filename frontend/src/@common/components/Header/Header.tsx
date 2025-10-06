import Flex from '@/@common/components/Flex/Flex';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';

import HomeButton from '../HomeButton/HomeButton';

import { HeaderStyle, HomeButtonStyle } from './Header.style';

import type { HeaderProps } from './Header.types';

const Header = ({ children, isHome }: HeaderProps) => {
  const { handleMoveToHome } = useRoutieSpaceNavigation();

  const moveToHome = () => {
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!accessToken || role === 'GUEST') {
      return;
    }

    handleMoveToHome();
  };

  return (
    <div css={HeaderStyle}>
      <Flex gap={1} height="100%" justifyContent="space-between" padding={1}>
        <HomeButton
          onClick={moveToHome}
          css={HomeButtonStyle}
          isHome={isHome}
        />
        {children}
      </Flex>
    </div>
  );
};

export default Header;
