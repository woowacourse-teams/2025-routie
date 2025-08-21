import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';

const RoutieValidationUnavailableCard = () => {
  return (
    <Card
      id="routie-validation-available-status-card"
      variant="disabled"
      height="5.4rem"
    >
      <Flex width="100%" gap={1.5} justifyContent="flex-start" height="100%">
        <Icon name="info" size={28} />
        <Flex alignItems="flex-start">
          <Text variant="caption">일정 검증 기능이 비활성화 상태입니다</Text>
          <Text variant="description">
            기능을 활성화하면 일정 검증을 받아보실 수 있습니다.
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutieValidationUnavailableCard;
