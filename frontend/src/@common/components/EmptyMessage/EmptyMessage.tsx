import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import type { EmptyMessageProps } from './EmptyMessage.types';

const EmptyMessage = ({ messages }: EmptyMessageProps) => {
  return (
    <Flex direction="column" gap={1} padding="8rem 0">
      {messages.map((msg, idx) => (
        <Text key={idx} variant="subTitle" color={theme.colors.gray[200]}>
          {msg}
        </Text>
      ))}
    </Flex>
  );
};

export default EmptyMessage;
