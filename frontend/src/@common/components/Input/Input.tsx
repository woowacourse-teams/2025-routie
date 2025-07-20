import { ComponentProps } from 'react';

import InputStyle, { InputLabelStyle, inputVariant } from './Input.style';

interface InputProps extends ComponentProps<'input'> {
  id: string;
  type?: string;
  label?: string;
  placeholder?: string;
  border?: boolean;
  variant?: keyof typeof inputVariant;
}

const Input = ({
  id,
  type,
  label,
  placeholder,
  variant = 'primary',
}: InputProps) => {
  return (
    <>
      <label css={InputLabelStyle} htmlFor={id}>
        {label}
      </label>
      <input
        css={InputStyle(variant)}
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={variant === 'disabled'}
      />
    </>
  );
};

export default Input;
