import { PillStyle } from './Pill.style';

import type { PillProps } from './Pill.types';

const Pill = ({ children, ...props }: PillProps) => {
  return (
    <div css={PillStyle} {...props}>
      {children}
    </div>
  );
};

export default Pill;
