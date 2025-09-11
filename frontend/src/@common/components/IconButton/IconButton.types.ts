import { ComponentProps } from 'react';

interface IconButtonProps extends ComponentProps<'button'> {
  variant?: IconButtonVariantType;
  icon: string;
  onClick?: () => void;
}

type IconButtonVariantType = 'delete' | 'select' | 'selected' | 'disable';

type IconButtonStyleProps = Pick<IconButtonProps, 'variant'>;

export type { IconButtonProps, IconButtonVariantType, IconButtonStyleProps };
