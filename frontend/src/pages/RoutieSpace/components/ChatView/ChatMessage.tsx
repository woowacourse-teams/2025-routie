/** @jsxImportSource @emotion/react */
import {
  bubbleStyle,
  bubbleWrapStyle,
  messageRowStyle,
  senderNameStyle,
  timestampStyle,
} from './ChatMessage.styles';

import type { ChatMessageProps } from './ChatMessage.types';

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({
  isMine,
  senderName,
  content,
  timestamp,
  status,
}: ChatMessageProps) => {
  return (
    <div css={messageRowStyle(isMine)}>
      {!isMine && <span css={senderNameStyle}>{senderName}</span>}
      <div css={bubbleWrapStyle(isMine)}>
        <div css={bubbleStyle(isMine)}>{content}</div>
        <span css={timestampStyle}>
          {status === 'pending' ? '...' : formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
