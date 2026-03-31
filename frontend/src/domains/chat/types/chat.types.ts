type ChatMessageStatus = 'pending' | 'sent';

interface ChatMessageType {
  messageId: string;
  tempId?: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  status: ChatMessageStatus;
  isMine: boolean;
}

export type { ChatMessageType, ChatMessageStatus };
