import Icon from '@/@common/components/IconSvg/Icon';

import {
  ToggleButtonIconStyle,
  ToggleButtonStyle,
} from './SidebarToggleButton.styles';

import type { SidebarToggleButtonProps } from './SidebarToggleButton.types';

const SidebarToggleButton = ({
  isOpen,
  onToggle,
}: SidebarToggleButtonProps) => {
  return (
    <button type="button" css={ToggleButtonStyle} onClick={onToggle}>
      <Icon name="arrow" size={20} css={ToggleButtonIconStyle(isOpen)} />
    </button>
  );
};

export default SidebarToggleButton;
