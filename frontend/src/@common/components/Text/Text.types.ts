import { ComponentProps } from 'react';

export interface TextProps extends ComponentProps<'p'> {
  color?: string;
  variant: TextVariantProps;
  ellipsis?: boolean;
}

export type TextVariantProps =
  | 'title'
  | 'subTitle'
  | 'caption'
  | 'label'
  | 'description';
