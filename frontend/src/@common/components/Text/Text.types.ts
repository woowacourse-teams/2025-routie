import { ComponentProps } from 'react';

interface TextProps extends ComponentProps<'p'> {
  color?: string;
  variant: TextVariantType;
  ellipsis?: boolean;
}

type TextVariantType =
  | 'title'
  | 'title2'
  | 'subTitle'
  | 'caption'
  | 'label'
  | 'description';

export type { TextProps, TextVariantType };
