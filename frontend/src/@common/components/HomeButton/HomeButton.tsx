import theme from '@/styles/theme';

import Flex from '../Flex/Flex';
import Text from '../Text/Text';

import type { HomeButtonProps } from './HomeButton.types';

const HomeButton = ({
  icon,
  isHome = true,
  onClick,
  ...props
}: HomeButtonProps) => {
  return (
    <button onClick={onClick} {...props}>
      <Flex gap={1}>
        <img src={icon} />
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
