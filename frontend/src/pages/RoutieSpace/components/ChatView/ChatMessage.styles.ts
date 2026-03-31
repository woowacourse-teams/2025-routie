import { css } from '@emotion/react';

import theme from '@/styles/theme';

const messageRowStyle = (isMine: boolean) => css`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: ${isMine ? 'flex-end' : 'flex-start'};
`;

const senderNameStyle = css`
  padding: 0 0.4rem;
  font-size: ${theme.font.size.label};
  color: ${theme.colors.gray[200]};
`;

const bubbleWrapStyle = (isMine: boolean) => css`
  display: flex;
  flex-direction: ${isMine ? 'row-reverse' : 'row'};
  gap: 0.5rem;
  align-items: flex-end;
`;

const bubbleStyle = (isMine: boolean) => css`
  max-width: 26rem;
  padding: 0.8rem 1.2rem;
  border-radius: ${isMine
    ? `${theme.radius.md} 4px ${theme.radius.md} ${theme.radius.md}`
    : `4px ${theme.radius.md} ${theme.radius.md} ${theme.radius.md}`};

  font-size: ${theme.font.size.caption};
  line-height: 1.5;
  color: ${isMine ? theme.colors.white : theme.colors.gray[300]};
  overflow-wrap: break-word;

  background-color: ${isMine ? theme.colors.blue[450] : theme.colors.gray[50]};
`;

const timestampStyle = css`
  padding-bottom: 0.2rem;
  font-size: ${theme.font.size.description};
  color: ${theme.colors.gray[100]};
  white-space: nowrap;
`;

export {
  messageRowStyle,
  senderNameStyle,
  bubbleWrapStyle,
  bubbleStyle,
  timestampStyle,
};
