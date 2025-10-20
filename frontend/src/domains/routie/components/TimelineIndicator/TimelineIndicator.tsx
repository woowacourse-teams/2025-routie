/** @jsxImportSource @emotion/react */
import { memo } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import {
  BottomLineStyle,
  TimelineCircleStyle,
  TimelineContainerStyle,
  TopLineStyle,
} from './TimelineIndicator.styles';

import type { TimelineIndicatorProps } from './TimelineIndicator.types';

const TimelineIndicator = ({
  sequence,
  isFirst,
  isLast,
}: TimelineIndicatorProps) => {
  return (
    <Flex direction="column" width="3.2rem" css={TimelineContainerStyle}>
      {!isFirst && <div css={TopLineStyle} />}
      <Flex
        width="3.2rem"
        height="3.2rem"
        css={TimelineCircleStyle}
        role="status"
        aria-label={`순서 ${sequence}`}
      >
        <Text variant="caption" color={theme.colors.white}>
          {sequence}
        </Text>
      </Flex>
      {!isLast && <div css={BottomLineStyle} />}
    </Flex>
  );
};

export default memo(TimelineIndicator);
