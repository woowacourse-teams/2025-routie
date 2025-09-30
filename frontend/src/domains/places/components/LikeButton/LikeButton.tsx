/** @jsxImportSource @emotion/react */
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { LikeButtonStyle } from './LikeButton.styles';

import type { LikeButtonProps } from './LikeButton.types';

const LikeButton = ({ count = 0, onClick }: LikeButtonProps) => {
  return (
    <button css={LikeButtonStyle} onClick={onClick} aria-label="좋아요">
      <Flex gap={1}>
        <Icon name="thumbsUp" size={20} />
        <Text variant="caption" color={theme.colors.gray[300]}>
          {count.toLocaleString()}
        </Text>
      </Flex>
    </button>
  );
};

export default LikeButton;
