import { ComponentProps } from 'react';

import FlexStyle from './Flex.style';

export interface FlexProps extends ComponentProps<'div'> {
  direction?: 'row' | 'column';
  alignItems?:
    | 'normal'
    | 'start'
    | 'center'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'baseline'
    | 'stretch'
    | 'initial'
    | 'inherit';
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'initial'
    | 'inherit';
  gap?: number;
  width?: string;
  height?: number | string;
  margin?: number;
  padding?: number;
}

const Flex = ({ children, ...props }: FlexProps) => {
  return (
    <div css={FlexStyle(props)} {...props}>
      {children}
    </div>
  );
};

export default Flex;
