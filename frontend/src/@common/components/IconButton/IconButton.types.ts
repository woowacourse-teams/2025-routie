import { ComponentProps } from 'react';

import { IconNameType } from '../IconSvg/Icon.types';

interface IconButtonProps extends ComponentProps<'button'> {
  variant?: IconButtonVariantType;
  icon: IconNameType;
  onClick?: () => void;
}

type IconButtonVariantType = 'delete' | 'select' | 'selected' | 'disable';

type IconButtonStyleProps = Pick<IconButtonProps, 'variant'>;

export type { IconButtonProps, IconButtonVariantType, IconButtonStyleProps };
