import Text from '@/@common/components/Text/Text';

import Icon from '../IconSvg/Icon';

import {
  InputStyle,
  InputContainerStyle,
  InputIconStyle,
  InputLabelStyle,
} from './Input.style';

import type { InputProps } from './Input.types';

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
  return (
    <>
      {label && (
        <label css={InputLabelStyle} htmlFor={id}>
          <Text variant="caption">{label}</Text>
        </label>
      )}
      <div css={InputContainerStyle}>
        {icon && <Icon name={icon} css={InputIconStyle} />}
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
