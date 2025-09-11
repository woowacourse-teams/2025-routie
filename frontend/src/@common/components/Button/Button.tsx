import { ButtonStyle } from './Button.style';

import type { ButtonProps } from './Button.types';

const Button = ({
  children,
  variant,
  width = '100%',
  ...props
}: ButtonProps) => {
  return (
    <button css={ButtonStyle({ variant, width })} {...props}>
      {children}
    </button>
  );
};

export default Button;
