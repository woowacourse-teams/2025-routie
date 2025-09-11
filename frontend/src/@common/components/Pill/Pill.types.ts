import { ComponentProps } from 'react';

interface PillProps extends ComponentProps<'div'> {
  variant?: PillVariantType;
  type: PillType;
}

type PillVariantType = 'default' | 'filled' | 'invalid';

type PillType = 'time' | 'distance' | 'default';

export type { PillProps, PillVariantType, PillType };
