import { css } from '@emotion/react';

import theme from '@/styles/theme';

const inputContainerStyle = css`
  display: flex;
  gap: 0.8rem;
  align-items: flex-end;

  padding: 1rem 1.2rem;
  border-top: 1px solid ${theme.colors.gray[25]};

  background-color: ${theme.colors.white};
`;

const textareaStyle = css`
  resize: none;

  overflow-y: hidden;
  flex: 1;

  padding: 0.7rem 0.8rem;
  border: 1.5px solid ${theme.colors.gray[25]};
  border-radius: ${theme.radius.sm};

  font-family: inherit;
  font-size: ${theme.font.size.caption};
  line-height: 1.5;
  color: ${theme.colors.gray[300]};

  background-color: ${theme.colors.white};
  outline: none;

  &::placeholder {
    color: ${theme.colors.gray[100]};
  }

  &:focus {
    border-color: ${theme.colors.blue[300]};
    border-width: 2px;
  }
`;

const sendButtonStyle = (disabled: boolean) => css`
  cursor: ${disabled ? 'default' : 'pointer'};

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  aspect-ratio: 1;
  width: 2.2rem;
  height: 3.2rem;
  border: none;
  border-radius: 50%;

  background-color: ${disabled
    ? theme.colors.gray[25]
    : theme.colors.blue[450]};

  transition: background-color 0.15s;
`;

const sendIconStyle = css`
  width: 1.6rem;
  height: 1.6rem;
  fill: ${theme.colors.white};
`;

export { inputContainerStyle, textareaStyle, sendButtonStyle, sendIconStyle };
