import { useState } from 'react';

import { TooltipContainerStyle, TooltipStyle } from './Tooltip.styles';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

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
