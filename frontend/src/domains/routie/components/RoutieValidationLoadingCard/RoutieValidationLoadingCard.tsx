import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';

const RoutieValidationLoadingCard = () => {
  return (
    <Card
      id="routie-validation-loading-card"
      variant="disabled"
      height="5.4rem"
    >
      <Flex width="100%" gap={1.5} justifyContent="flex-start" height="100%">
        <Icon name="loading" size={28} />
        <Flex alignItems="flex-start">
          <Text variant="caption">검증 진행중...</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutieValidationLoadingCard;
