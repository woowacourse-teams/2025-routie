import { ComponentProps } from 'react';

export interface ButtonProps extends ComponentProps<'button'> {
  variant: ButtonVariantProps;
}

export type ButtonVariantProps = 'primary' | 'secondary';
