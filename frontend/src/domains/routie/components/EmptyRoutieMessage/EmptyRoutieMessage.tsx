import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

const EmptyRoutieMessage = () => (
  <Flex width="100%" padding={8} style={{ textAlign: 'center' }}>
    <Text variant="subTitle">
      동선이 생성되지 않았어요. <br />
      장소를 2개 이상 추가하면 동선이 생성됩니다!
    </Text>
  </Flex>
);

export default EmptyRoutieMessage;
