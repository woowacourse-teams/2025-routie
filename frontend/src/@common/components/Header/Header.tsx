import { useNavigate } from 'react-router';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import logoIcon from '@/assets/icons/logo.svg';

import Button from '../Button/Button';

import headerStyle from './Header.style';
import HomeButton from './HomeButton/HomeButton';
import { buttonStyle } from './HomeButton/HomeButton.styles';

interface HeaderProps {
  handleViewModeChange?: () => void;
}

const Header = ({ handleViewModeChange }: HeaderProps) => {
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
        ></HomeButton>
        {handleViewModeChange && (
          <Button variant="primary" width="20%" onClick={handleViewModeChange}>
            <Flex alignItems="center" justifyContent="center" width="100%">
              <Text variant="subTitle" color="white">
                뷰모드 변경
              </Text>
            </Flex>
          </Button>
        )}
      </Flex>
    </div>
  );
};

export default Header;
