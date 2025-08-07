import { TextStyle } from './Text.style';
import { TextProps } from './Text.types';

const Text = ({ children, ...props }: TextProps) => {
  return (
    <p css={TextStyle(props)} {...props}>
      {children}
    </p>
  );
};

export default Text;
