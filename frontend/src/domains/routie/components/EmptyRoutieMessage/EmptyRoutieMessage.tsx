import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

const EmptyRoutieMessage = () => (
  <Flex width="100%" direction="column" padding={8} gap={1}>
    <Text variant="subTitle" color={theme.colors.gray[200]}>
      동선이 생성되지 않았어요.
    </Text>
    <Text variant="subTitle" color={theme.colors.gray[200]}>
      장소를 2개 이상 추가하면 동선이 생성됩니다!
    </Text>
  </Flex>
);

export default EmptyRoutieMessage;
