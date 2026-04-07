import { useCallback, useState } from 'react';

import type { UserRole } from '@/domains/auth/types/api.types';
import { useWebSocket } from '@/libs/websocket/hooks/useWebSocket';

import type { ChatMessageResponse } from '../types/api.types';
import type { ChatMessageType } from '../types/chat.types';

const WS_CHAT_URL = `${process.env.REACT_APP_API_URL?.replace(/^http/, 'ws') ?? 'ws://localhost:8080'}/ws/chat/v1`;

interface UseChatParams {
  routieSpaceUuid: string;
  accessToken: string;
  myNickname: string;
  myRole: UserRole;
}

const useChat = ({ routieSpaceUuid, accessToken, myNickname, myRole }: UseChatParams) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleMessage = useCallback(
    (data: ChatMessageResponse) => {
      setMessages((prev) => {
        if (data.tempId) {
          const pendingIndex = prev.findIndex((msg) => msg.tempId === data.tempId);
          if (pendingIndex !== -1) {
            return prev.map((msg) =>
              msg.tempId === data.tempId
                ? { ...msg, messageId: data.messageId, timestamp: data.timestamp, status: 'sent', tempId: undefined }
                : msg,
            );
          }
        }

        if (prev.some((msg) => msg.messageId === data.messageId)) return prev;

        return [
          ...prev,
          {
            messageId: data.messageId,
            senderId: data.senderId,
            senderRole: data.senderRole,
            senderName: data.senderName,
            content: data.content,
            timestamp: data.timestamp,
            status: 'sent',
            isMine: false,
          },
        ];
      });
    },
    [],
  );

  const { send } = useWebSocket<ChatMessageResponse>({
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
          senderRole: myRole,
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

      const isSent = send({ type: 'CHAT', tempId, content });
      if (!isSent) {
        setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
      }
    },
    [send, myNickname, myRole, isConnected],
  );

  return { messages, sendMessage };
};

export { useChat };
