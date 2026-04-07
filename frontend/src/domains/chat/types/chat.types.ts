import type { UserRole } from '@/domains/auth/types/api.types';

type ChatMessageStatus = 'pending' | 'sent';

interface ChatMessageType {
  messageId: string;
  tempId?: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  content: string;
  timestamp: string;
  status: ChatMessageStatus;
  isMine: boolean;
}

export type { ChatMessageType, ChatMessageStatus };
