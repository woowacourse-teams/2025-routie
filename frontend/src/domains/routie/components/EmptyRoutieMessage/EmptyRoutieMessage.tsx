import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

// TODO: common에 있는 컴포넌트를 재사용하면 좋을 듯
const EmptyRoutieMessage = () => (
  <Flex padding="8rem 0" direction="column" gap={1}>
    <Text variant="subTitle" color={theme.colors.gray[200]}>
      아직 동선이 없습니다.
    </Text>
    <Text variant="subTitle" color={theme.colors.gray[200]}>
      장소 목록에서 2곳 이상을 선택하면 동선이 생성됩니다!
    </Text>
  </Flex>
);

export default EmptyRoutieMessage;
