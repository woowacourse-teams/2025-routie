import { ComponentProps } from 'react';

interface CardProps extends ComponentProps<'div'> {
  id: string;
  children: React.ReactNode;
  variant?: CardVariantType;
  width?: string;
  height?: string;
}

type CardVariantType =
  | 'default'
  | 'defaultStatic'
  | 'available'
  | 'unavailable'
  | 'disabled'
  | 'invalid'
  | 'valid';

export type { CardProps, CardVariantType };
