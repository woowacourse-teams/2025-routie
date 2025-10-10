/** @jsxImportSource @emotion/react */
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

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
