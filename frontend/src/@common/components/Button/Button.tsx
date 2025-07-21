import { ButtonStyle } from './Button.style';
import { ButtonProps } from './Button.types';

const Button = ({ children, variant, ...props }: ButtonProps) => {
  return (
    <button css={ButtonStyle({ variant })} {...props}>
      {children}
    </button>
  );
};

export default Button;
