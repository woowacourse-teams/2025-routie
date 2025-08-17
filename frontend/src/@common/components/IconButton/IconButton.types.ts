import { ComponentProps } from 'react';

export interface IconButtonProps extends ComponentProps<'button'> {
  variant?: IconButtonVariantProps;
  icon: string;
  onClick?: () => void | Promise<void>;
}

export type IconButtonVariantProps =
  | 'delete'
  | 'select'
  | 'selected'
  | 'disable';

export type IconButtonStyleProps = Pick<IconButtonProps, 'variant'>;
