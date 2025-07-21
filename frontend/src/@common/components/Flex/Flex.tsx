import FlexStyle from './Flex.style';
import FlexProps from './Flex.types';

const Flex = ({ children, ...props }: FlexProps) => {
  return (
    <div css={FlexStyle(props)} {...props}>
      {children}
    </div>
  );
};

export default Flex;
