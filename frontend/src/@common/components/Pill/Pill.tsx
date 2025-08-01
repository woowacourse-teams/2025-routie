import clockIcon from '@/assets/icons/clock.svg';

import { PillStyle } from './Pill.style';
import { PillProps } from './Pill.types';

const Pill = ({ children, variant = 'default', type, ...props }: PillProps) => {
  return (
    <div css={PillStyle({ variant, type })} {...props}>
      {type === 'time' && <img src={clockIcon} />}
      {children}
    </div>
  );
};

export default Pill;
