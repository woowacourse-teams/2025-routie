import { css } from '@emotion/react';
interface DraggableCardWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DraggableCardWrapper = ({ children }: DraggableCardWrapperProps) => {
  return <div css={DraggableCardWrapperStyle}>{children}</div>;
};

export default DraggableCardWrapper;

const DraggableCardWrapperStyle = css`
  cursor: grab;
  border-radius: 12px;
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
  }
`;
