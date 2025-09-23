import theme from '@/styles/theme';

import Flex from '../Flex/Flex';
import Icon from '../IconSvg/Icon';
import Text from '../Text/Text';

import type { HomeButtonProps } from './HomeButton.types';

const HomeButton = ({ isHome = true, onClick, ...props }: HomeButtonProps) => {
  return (
    <button onClick={onClick} {...props}>
      <Flex gap={1}>
        <Icon name="logo" size={34} />
        {isHome && (
          <Text variant="title" color={theme.colors.purple[400]}>
            Routie
          </Text>
        )}
      </Flex>
    </button>
  );
};

export default HomeButton;
