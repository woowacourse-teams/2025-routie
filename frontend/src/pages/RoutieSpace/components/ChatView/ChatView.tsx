/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react';

import Icon from '@/@common/components/IconSvg/Icon';
import { useChat } from '@/domains/chat/hooks/useChat';
import { getRoutieSpaceUuid } from '@/domains/utils/routieSpaceUuid';

import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import {
  chatIconButtonStyle,
  chatPanelCloseButtonStyle,
  chatPanelHeaderStyle,
  chatPanelHeaderTitleStyle,
  chatPanelStyle,
  emptyMessageStyle,
  messageListStyle,
} from './ChatView.styles';

import type { ChatViewProps } from './ChatView.types';

const ChatView = ({ accessToken, myNickname }: ChatViewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const routieSpaceUuid = getRoutieSpaceUuid() ?? '';
  const messageListRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat({
    routieSpaceUuid,
    accessToken,
    myNickname,
  });

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div css={chatPanelStyle(isOpen)}>
        <div css={chatPanelHeaderStyle}>
          <span css={chatPanelHeaderTitleStyle}>채팅</span>
          <button
            css={chatPanelCloseButtonStyle}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
        <div ref={messageListRef} css={messageListStyle}>
          {messages.length === 0 ? (
            <div css={emptyMessageStyle}>첫 메시지를 보내보세요!</div>
          ) : (
            messages.map((msg) => <ChatMessage key={msg.messageId} {...msg} />)
          )}
        </div>
        <ChatInput onSend={sendMessage} />
      </div>

      <div
        css={chatIconButtonStyle}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Icon name="chatTab" size={36} />
      </div>
    </>
  );
};

export default ChatView;
