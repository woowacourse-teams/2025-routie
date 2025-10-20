import { css } from '@emotion/react';

const PlaceItemContainerStyle = css`
  cursor: grab;

  /* 드래그 시 텍스트 선택 방지 */
  user-select: none;

  display: flex;
  gap: 2rem;
  align-items: center;

  width: 100%;

  &:active {
    cursor: grabbing;
  }
`;

export { PlaceItemContainerStyle };
