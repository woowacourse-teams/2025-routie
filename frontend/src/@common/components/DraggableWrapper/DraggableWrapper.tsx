import { DraggableWrapperStyle } from './DraggableWrapper.styles';

import type { DraggableCardWrapperProps } from './DraggableWrapper.types';

const DraggableWrapper = ({ children }: DraggableCardWrapperProps) => {
  return <div css={DraggableWrapperStyle}>{children}</div>;
};

export default DraggableWrapper;
