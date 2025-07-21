import { ComponentProps } from 'react';

import { ButtonStyle, buttonVariant } from './Button.style';

export interface ButtonProps extends ComponentProps<'button'> {
  variant: keyof typeof buttonVariant;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button css={ButtonStyle(props)} {...props}>
      {children}
    </button>
  );
};

export default Button;
