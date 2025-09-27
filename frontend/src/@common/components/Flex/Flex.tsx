/** @jsxImportSource @emotion/react */
import { FlexStyle } from './Flex.style';

import type { FlexProps } from './Flex.types';

const Flex = ({ children, ...props }: FlexProps) => {
  return (
    <div css={FlexStyle(props)} {...props}>
      {children}
    </div>
  );
};

export default Flex;
