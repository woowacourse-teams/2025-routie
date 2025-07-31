import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import infoIcon from '@/assets/icons/info.svg';

const RoutieValidationUnavailableCard = () => {
  return (
    <Card
      id="routie-validation-available-status-card"
      width="100%"
      variant="disabled"
      height="5.4rem"
    >
      <Flex width="100%" gap={1.5} justifyContent="flex-start" height="100%">
        <img src={infoIcon} alt="info" />
        <Flex direction="column" gap={0.3} alignItems="flex-start">
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
