import { ButtonStyle } from './Button.style';

import type { ButtonProps } from './Button.types';

const Button = ({
  children,
  variant,
  width,
  padding,
  ...props
}: ButtonProps) => {
  return (
    <button css={ButtonStyle({ variant, width, padding })} {...props}>
      {children}
    </button>
  );
};

export default Button;
