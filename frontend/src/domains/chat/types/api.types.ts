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

interface ChatMessageResponse {
  type: 'CHAT';
  messageId: string;
  senderId: string;
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
