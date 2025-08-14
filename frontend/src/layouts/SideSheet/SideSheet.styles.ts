import { css } from '@emotion/react';
import theme from '@/styles/theme';

export const sheetBase = css`
  position: absolute;
  z-index: 1000;
  top: 1rem;
  bottom: 1rem;
  left: 1rem;

  display: flex;
  flex-direction: column;

  width: 40rem;
  min-height: 0;
  border-radius: 12px;

  background: ${theme.colors.white};

  transition: transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 300ms ease, opacity 300ms ease;
`;

export const sheetContent = css`
  overflow-y: visible;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: flex-start;
`;

export const sheetOpen = css`
  pointer-events: auto;
  transform: translateX(0);
  opacity: 1;
  box-shadow: 0 4px 20px rgb(0 0 0 / 15%);
`;

export const sheetClosed = css`
  transform: translateX(calc(-100% + 3.6rem - 20px));
  opacity: 0.96;
  box-shadow: none;
`;

export const tabBase = css`
  pointer-events: auto;
  cursor: pointer;

  position: absolute;
  top: 50%;
  right: -1.8rem;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 2.4rem;
  height: 5rem;
  border: none;
  border-radius: 0 8px 8px 0;

  background: ${theme.colors.white};
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);

  transition: background-color 200ms ease, transform 300ms ease,
    box-shadow 300ms ease;

  &:hover {
    transform: translateY(-50%) scale(1.05);
    background-color: ${theme.colors.gray[50]};
    box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
  }
`;

export const iconBase = css`
  transform-origin: center;
  width: 1.4rem;
  height: 1.4rem;
  transition: transform 300ms ease;
`;

export const iconFlipped = css`
  transform: scaleX(-1);
`;
