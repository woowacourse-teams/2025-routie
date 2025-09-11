import { useState } from 'react';

import { TooltipContainerStyle, TooltipStyle } from './Tooltip.styles';

import type { TooltipProps } from './Tooltip.types';

const Tooltip = ({ content, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div
      css={TooltipContainerStyle}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && <div css={TooltipStyle}>{content}</div>}
    </div>
  );
};

export default Tooltip;
