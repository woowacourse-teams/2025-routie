/** @jsxImportSource @emotion/react */
import { useState } from 'react';

import {
  inputContainerStyle,
  sendButtonStyle,
  sendIconStyle,
  textareaStyle,
} from './ChatInput.styles';

interface ChatInputProps {
  onSend: (content: string) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = value.trim().length === 0;

  return (
    <div css={inputContainerStyle}>
      <textarea
        css={textareaStyle}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        rows={1}
      />
      <button type="button" aria-label="메시지 전송" css={sendButtonStyle(isEmpty)} onClick={handleSend} disabled={isEmpty}>
        <svg css={sendIconStyle} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 21L23 12 2 3v7l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
