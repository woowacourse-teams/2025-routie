interface ChatViewProps {
  accessToken: string;
  myNickname: string;
}

interface ChatViewInnerProps extends ChatViewProps {
  routieSpaceUuid: string;
}

export type { ChatViewProps, ChatViewInnerProps };
