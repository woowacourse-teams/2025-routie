import clockIcon from '@/assets/icons/clock.svg';
import searchIcon from '@/assets/icons/search.svg';

import {
  InputStyle,
  InputContainerStyle,
  InputIconStyle,
  InputLabelStyle,
} from './Input.style';
import { InputProps } from './Input.types';

const Input = ({
  id,
  type,
  label,
  placeholder = '',
  value,
  onChange,
  variant = 'primary',
  icon,
  ...props
}: InputProps) => {
  const iconSrc =
    icon === 'search' ? searchIcon : icon === 'clock' ? clockIcon : null;

  return (
    <>
      {label && (
        <label css={InputLabelStyle} htmlFor={id}>
          {label}
        </label>
      )}
      <div css={InputContainerStyle}>
        {iconSrc && <img src={iconSrc} alt="input-icon" css={InputIconStyle} />}
        <input
          css={InputStyle({ variant, icon })}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={variant === 'disabled'}
          {...props}
        />
      </div>
    </>
  );
};

export default Input;
