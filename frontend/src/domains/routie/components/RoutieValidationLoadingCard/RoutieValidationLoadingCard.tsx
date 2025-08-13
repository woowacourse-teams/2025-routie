import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

import { loadingCardStyle } from './RoutieValidationLoadingCard.styles';

const RoutieValidationLoadingCard = () => {
  return (
    <Card
      id="routie-validation-loading-card"
      width="100%"
      variant="disabled"
      height="5.4rem"
    >
      <Flex width="100%" gap={1.5} justifyContent="flex-start" height="100%">
        <Text variant="caption" css={loadingCardStyle}>
          🔄
        </Text>
        <Flex direction="column" gap={0.3} alignItems="flex-start">
          <Text variant="caption">검증 진행중...</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutieValidationLoadingCard;
