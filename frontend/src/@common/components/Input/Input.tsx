import { ComponentProps } from 'react';

import clockIcon from '@/assets/icons/clock.svg';
import searchIcon from '@/assets/icons/search.svg';

import {
  InputStyle,
  InputContainerStyle,
  InputIconStyle,
  InputLabelStyle,
  inputVariant,
} from './Input.style';

interface InputProps extends ComponentProps<'input'> {
  id: string;
  type?: string;
  label?: string;
  placeholder?: string;
  border?: boolean;
  variant?: keyof typeof inputVariant;
  icon?: 'search' | 'clock';
}

const Input = ({
  id,
  type,
  label,
  placeholder,
  variant = 'primary',
  icon,
}: InputProps) => {
  const iconSrc =
    icon === 'search' ? searchIcon : icon === 'clock' ? clockIcon : null;

  return (
    <>
      <label css={InputLabelStyle} htmlFor={id}>
        {label}
      </label>
      <div css={InputContainerStyle}>
        {iconSrc && <img src={iconSrc} alt="input-icon" css={InputIconStyle} />}
        <input
          css={InputStyle(variant, icon)}
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={variant === 'disabled'}
        />
      </div>
    </>
  );
};

export default Input;
