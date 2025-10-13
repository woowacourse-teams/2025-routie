import { css } from '@emotion/react';

import theme from '@/styles/theme';

const TimelineContainerStyle = css`
  position: relative;
`;

const TimelineCircleStyle = css`
  z-index: 2;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${theme.colors.blue[450]};
`;

const TimelineLineStyle = css`
  position: absolute;
  z-index: 1;

  width: 0.2rem;
  height: 3.6rem;

  background-color: ${theme.colors.blue[200]};
`;

const TopLineStyle = css`
  ${TimelineLineStyle}

  top: 0;
  transform: translateY(-100%);
`;

const BottomLineStyle = css`
  ${TimelineLineStyle}

  bottom: 0;
  transform: translateY(100%);
`;

export {
  BottomLineStyle,
  TimelineCircleStyle,
  TimelineContainerStyle,
  TimelineLineStyle,
  TopLineStyle,
};
