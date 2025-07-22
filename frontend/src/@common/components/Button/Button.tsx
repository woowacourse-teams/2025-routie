import { ButtonStyle } from './Button.style';
import { ButtonProps } from './Button.types';

const Button = ({ children, variant, width, ...props }: ButtonProps) => {
  return (
    <button css={ButtonStyle({ variant, width })} {...props}>
      {children}
    </button>
  );
};

export default Button;
