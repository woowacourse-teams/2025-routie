import { ComponentProps } from 'react';

export interface PillProps extends ComponentProps<'div'> {
  variant?: PillVariantProps;
  type: PillType;
}

export type PillVariantProps = 'default' | 'filled';

export type PillType = 'time' | 'distance';
