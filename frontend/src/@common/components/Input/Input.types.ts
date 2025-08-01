import { ComponentProps } from 'react';

export interface InputProps
  extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
  id: string;
  type?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: InputVariantProps;
  icon?: 'search' | 'clock';
}

export type InputVariantProps = 'primary' | 'disabled' | 'error';

export type InputStyleProps = Pick<InputProps, 'variant' | 'icon'>;
