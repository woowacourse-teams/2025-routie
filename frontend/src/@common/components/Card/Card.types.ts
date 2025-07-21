import { ComponentProps } from 'react';

export interface CardProps extends ComponentProps<'div'> {
  id: string;
  variant?: CardVariantProps;
  children?: React.ReactNode;
}

export type CardVariantProps =
  | 'default'
  | 'available'
  | 'unavailable'
  | 'disabled';
