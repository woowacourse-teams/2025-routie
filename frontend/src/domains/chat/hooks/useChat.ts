import { useCallback, useState } from 'react';

import { useWebSocket } from '@/libs/websocket/hooks/useWebSocket';

import type { ChatIncomingMessageType } from '../types/api.types';
import type { ChatMessageType } from '../types/chat.types';

const WS_CHAT_URL = `${process.env.REACT_APP_API_URL?.replace(/^http/, 'ws') ?? 'ws://localhost:8080'}/ws/chat/v1`;

interface UseChatParams {
  routieSpaceUuid: string;
  accessToken: string;
  myNickname: string;
}

const useChat = ({ routieSpaceUuid, accessToken, myNickname }: UseChatParams) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleMessage = useCallback(
    (data: ChatIncomingMessageType) => {
      if (data.type === 'CHAT_ACK') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === data.tempId
              ? { ...msg, messageId: data.messageId, timestamp: data.timestamp, status: 'sent', tempId: undefined }
              : msg,
          ),
        );
        return;
      }

      if (data.type === 'CHAT') {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) => msg.messageId === data.messageId || msg.tempId === data.messageId,
          );
          if (alreadyExists) return prev;

          return [
            ...prev,
            {
              messageId: data.messageId,
              senderId: data.senderId,
              senderName: data.senderName,
              content: data.content,
              timestamp: data.timestamp,
              status: 'sent',
              isMine: data.senderId === myNickname,
            },
          ];
        });
      }
    },
    [myNickname],
  );

  const { send } = useWebSocket<ChatIncomingMessageType>({
    url: WS_CHAT_URL,
    token: accessToken,
    subscribeDestination: `/topic/chat/${routieSpaceUuid}`,
    publishDestination: `/app/chat/${routieSpaceUuid}`,
    onMessage: handleMessage,
    onConnect: useCallback(() => setIsConnected(true), []),
    onDisconnect: useCallback(() => setIsConnected(false), []),
  });

  const sendMessage = useCallback(
    (content: string) => {
      const tempId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        {
          messageId: tempId,
          tempId,
          senderId: myNickname,
          senderName: myNickname,
          content,
          timestamp: new Date().toISOString(),
          status: 'pending',
          isMine: true,
        },
      ]);

      if (!isConnected) {
        setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
        return;
      }

      const isSent = send({ type: 'CHAT', routieSpaceId: routieSpaceUuid, tempId, content });
      if (!isSent) {
        setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
      }
    },
    [send, myNickname, isConnected, routieSpaceUuid],
  );

  return { messages, sendMessage };
};

export { useChat };
