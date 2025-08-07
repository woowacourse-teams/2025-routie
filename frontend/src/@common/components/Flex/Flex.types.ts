import { ComponentProps } from 'react';

interface FlexProps extends ComponentProps<'div'> {
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

export default FlexProps;
