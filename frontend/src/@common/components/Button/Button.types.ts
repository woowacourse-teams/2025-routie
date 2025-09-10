import { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariantType;
  width?: string;
}

type ButtonVariantType = 'primary' | 'secondary';

export type { ButtonProps, ButtonVariantType };
