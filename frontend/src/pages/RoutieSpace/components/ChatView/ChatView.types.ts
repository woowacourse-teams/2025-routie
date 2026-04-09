import type { UserRole } from '@/domains/auth/types/api.types';

interface ChatViewProps {
  accessToken: string;
  myNickname: string;
  myRole: UserRole;
}

interface ChatViewInnerProps extends ChatViewProps {
  routieSpaceUuid: string;
}

export type { ChatViewProps, ChatViewInnerProps };
