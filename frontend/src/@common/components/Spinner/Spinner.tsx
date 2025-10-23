import theme from '@/styles/theme';

import { SpinnerStyle } from './Spinner.style';

import type { SpinnerProps } from './Spinner.types';

const Spinner = ({
  size = 36,
  thickness = 4,
  speed = 1,
  color = theme.colors.black,
  trackColor = theme.colors.gray[50],
}: SpinnerProps) => {
  return (
    <div css={SpinnerStyle({ size, thickness, speed, color, trackColor })} />
  );
};

export default Spinner;
