import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

import { WaitingReason } from '../../types/routie.types';

import { waitingCardStyle } from './RoutieValidationWaitingCard.styles';

interface RoutieValidationWaitingCardProps {
  reason: WaitingReason;
}

const getWaitingMessage = (reason: WaitingReason) => {
  switch (reason) {
    case 'no_date':
      return {
        title: '검증 대기중',
        description: '날짜를 입력해주세요.',
      };
    case 'insufficient_places':
      return {
        title: '검증 대기중',
        description: '검증을 위해 장소를 2개 이상 추가해주세요.',
      };
    default:
      return {
        title: '검증 대기중',
        description: '검증 조건을 확인하고 있습니다.',
      };
  }
};

const RoutieValidationWaitingCard = ({
  reason,
}: RoutieValidationWaitingCardProps) => {
  const { title, description } = getWaitingMessage(reason);

  return (
    <Card
      id="routie-validation-waiting-card"
      width="100%"
      variant="disabled"
      height="5.4rem"
    >
      <Flex width="100%" gap={1.5} justifyContent="flex-start" height="100%">
        <Text variant="caption" css={waitingCardStyle}>
          ⏳
        </Text>
        <Flex gap={0.3} direction="column" alignItems="flex-start">
          <Text variant="caption">{title}</Text>
          <Text variant="description">{description}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutieValidationWaitingCard;
