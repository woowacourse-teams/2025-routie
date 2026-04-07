import type { UserRole } from '@/domains/auth/types/api.types';

interface ChatSendRequest {
  type: 'CHAT';
  routieSpaceId: string;
  tempId: string;
  content: string;
}

interface ChatMessageResponse {
  type: 'CHAT';
  tempId?: string;
  messageId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  content: string;
  timestamp: string;
}

export type { ChatSendRequest, ChatMessageResponse };
