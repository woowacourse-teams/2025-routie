/** @jsxImportSource @emotion/react */
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { LikeButtonStyle } from './LikeButton.styles';

import type { LikeButtonProps } from './LikeButton.types';

const LikeButton = ({ count = 0, liked, onClick }: LikeButtonProps) => {
  return (
    <button css={LikeButtonStyle(liked)} onClick={onClick}>
      <Flex gap={1}>
        <Icon name="thumbsUp" size={20} alt="" />
        <Text variant="caption" color={theme.colors.gray[300]} aria-hidden>
          {count.toLocaleString()}
        </Text>
      </Flex>
      <span className="hide">
        좋아요 {count}개, 엔터를 눌러
        {liked
          ? '좋아요를 해제할 수 있습니다.'
          : '좋아요를 선택할 수 있습니다.'}
      </span>
    </button>
  );
};

export default LikeButton;
