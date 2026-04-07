interface ChatSendRequest {
  type: 'CHAT';
  routieSpaceId: string;
  tempId: string;
  content: string;
}

interface ChatAckResponse {
  type: 'CHAT_ACK';
  tempId: string;
  messageId: string;
  timestamp: string;
}

import type { UserRole } from '@/domains/auth/types/api.types';

interface ChatMessageResponse {
  type: 'CHAT';
  messageId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  content: string;
  timestamp: string;
}

type ChatIncomingMessageType = ChatAckResponse | ChatMessageResponse;

export type {
  ChatSendRequest,
  ChatAckResponse,
  ChatMessageResponse,
  ChatIncomingMessageType,
};
