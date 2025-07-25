import { ComponentProps } from 'react';

export interface ButtonProps extends ComponentProps<'button'> {
  variant: ButtonVariantProps;
  width?: string;
}

export type ButtonVariantProps = 'primary' | 'secondary';
