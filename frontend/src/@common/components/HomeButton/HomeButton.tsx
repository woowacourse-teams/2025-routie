/** @jsxImportSource @emotion/react */
import theme from '@/styles/theme';

import Flex from '../Flex/Flex';
import Icon from '../IconSvg/Icon';
import Text from '../Text/Text';

import type { HomeButtonProps } from './HomeButton.types';

const HomeButton = ({ onClick, ...props }: HomeButtonProps) => {
  return (
    <button onClick={onClick} {...props}>
      <Flex gap={1}>
        <Icon name="logo" size={34} />
        <Text variant="logo" color={theme.colors.blue[450]}>
          Routie
        </Text>
      </Flex>
    </button>
  );
};

export default HomeButton;
