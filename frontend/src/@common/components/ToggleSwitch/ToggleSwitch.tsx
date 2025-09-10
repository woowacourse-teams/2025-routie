import {
  ToggleHiddenCheckbox,
  ToggleContainer,
  ToggleStyle,
} from './ToggleSwitch.style';

interface ToggleSwitchProps {
  active: boolean;
  onToggle: () => void;
}

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
