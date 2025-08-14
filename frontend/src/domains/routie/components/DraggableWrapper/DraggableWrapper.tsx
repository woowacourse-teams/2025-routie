import { css } from '@emotion/react';
interface DraggableCardWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DraggableWrapper = ({ children }: DraggableCardWrapperProps) => {
  return <div css={DraggableWrapperStyle}>{children}</div>;
};

export default DraggableWrapper;

const DraggableWrapperStyle = css`
  cursor: grab;
  border-radius: 1.2rem;
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  &:hover {
    transform: translateY(-0.2rem);
    box-shadow: 0 0.8rem 2.4rem rgb(0 0 0 / 12%);
  }
`;
