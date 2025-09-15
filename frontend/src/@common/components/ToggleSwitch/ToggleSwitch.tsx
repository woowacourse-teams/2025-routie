import {
  ToggleHiddenCheckbox,
  ToggleContainer,
  ToggleStyle,
} from './ToggleSwitch.style';

import type { ToggleSwitchProps } from './ToggleSwitch.types';

const ToggleSwitch = ({ active, onToggle }: ToggleSwitchProps) => {
  return (
    <div css={ToggleContainer}>
      <input
        type="checkbox"
        id="toggle"
        checked={active}
        onChange={onToggle}
        css={ToggleHiddenCheckbox}
      />
      <label htmlFor="toggle" css={ToggleStyle(active)} />
    </div>
  );
};

export default ToggleSwitch;
