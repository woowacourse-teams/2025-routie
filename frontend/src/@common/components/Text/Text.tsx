import { ComponentProps } from 'react';

import TextStyle, { textVariant } from './Text.style';

export interface TextProps extends ComponentProps<'p'> {
  color?: string;
  variant: keyof typeof textVariant;
}

const Text = ({ children, ...props }: TextProps) => {
  return (
    <p css={TextStyle(props)} {...props}>
      {children}
    </p>
  );
};

export default Text;
