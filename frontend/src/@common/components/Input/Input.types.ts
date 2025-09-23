import { ComponentProps } from 'react';

import type { IconNameType } from '@/@common/components/IconSvg/Icon.types';

interface InputProps
  extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
  id: string;
  type?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: InputVariantType;
  icon?: IconNameType;
  error?: boolean;
}

type InputVariantType = 'primary' | 'disabled' | 'error';

type InputStyleProps = Pick<InputProps, 'variant' | 'icon'>;

export type { InputProps, InputVariantType, InputStyleProps };
