import { DraggableWrapperStyle } from './DraggableWrapper.styles';
interface DraggableCardWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DraggableWrapper = ({ children }: DraggableCardWrapperProps) => {
  return <div css={DraggableWrapperStyle}>{children}</div>;
};

export default DraggableWrapper;
