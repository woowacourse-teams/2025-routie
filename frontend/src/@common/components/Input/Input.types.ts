import { ComponentProps } from 'react';

export interface InputProps extends ComponentProps<'input'> {
  id: string;
  type?: string;
  label?: string;
  placeholder?: string;
  border?: boolean;
  variant?: InputVariantProps;
  icon?: 'search' | 'clock';
}

export type InputVariantProps = 'primary' | 'disabled' | 'error';

export type InputStyleProps = Pick<InputProps, 'variant' | 'icon'>;
