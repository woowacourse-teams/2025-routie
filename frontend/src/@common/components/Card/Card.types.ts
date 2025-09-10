import { ComponentProps } from 'react';

interface CardProps extends ComponentProps<'div'> {
  id: string;
  variant?: CardVariantType;
  width?: string | undefined;
  height?: string | undefined;
  children?: React.ReactNode;
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
