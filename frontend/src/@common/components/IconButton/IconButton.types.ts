import { ComponentProps } from 'react';

export interface IconButtonProps extends ComponentProps<'button'> {
  variant?: IconButtonVariantProps;
  icon: string;
  onClick: () => void;
}

export type IconButtonVariantProps = 'delete' | 'drag'| 'select' | 'selected';

export type IconButtonStyleProps = Pick<IconButtonProps, 'variant'>;
