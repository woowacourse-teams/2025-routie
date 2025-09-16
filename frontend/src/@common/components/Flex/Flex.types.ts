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
  maxWidth?: string;
  minWidth?: string;
  height?: string | number;
  margin?: string | number;
  padding?: string | number;
  flex?: string | number;
}

export type { FlexProps };
