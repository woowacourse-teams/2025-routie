import { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariantType;
  width?: string;
  padding?: string;
  radius?: 'sm' | 'md' | 'lg';
}

type ButtonVariantType = 'primary' | 'secondary' | 'danger' | 'dangerSecondary';

export type { ButtonProps, ButtonVariantType };
