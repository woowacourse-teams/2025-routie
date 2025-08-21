import { ComponentProps } from 'react';

export interface CardProps extends ComponentProps<'div'> {
  id: string;
  variant?: CardVariantProps;
  width?: string | undefined;
  height?: string | undefined;
  children?: React.ReactNode;
}

export type CardVariantProps =
  | 'default'
  | 'defaultStatic'
  | 'available'
  | 'unavailable'
  | 'disabled'
  | 'invalid'
  | 'valid';
