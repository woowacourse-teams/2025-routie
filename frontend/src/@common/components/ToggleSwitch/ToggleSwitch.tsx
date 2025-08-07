import {
  hiddenCheckbox,
  toggleSwitchContainer,
  toggleStyle,
} from './ToggleSwitch.style';

interface ToggleSwitchProps {
  active: boolean;
  onToggle: () => void;
}

const ToggleSwitch = ({ active, onToggle }: ToggleSwitchProps) => {
  return (
    <div css={toggleSwitchContainer}>
      <input
        type="checkbox"
        id="toggle"
        checked={active}
        onChange={onToggle}
        css={hiddenCheckbox}
      />
      <label htmlFor="toggle" css={toggleStyle(active)} />
    </div>
  );
};

export default ToggleSwitch;
