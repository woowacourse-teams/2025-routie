import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import failIcon from '@/assets/icons/fail.svg';
import successIcon from '@/assets/icons/success.svg';

interface RoutieValidationResultCardProps {
  valid: boolean;
  total_time: string;
}

const RoutieValidationResultCard = ({
  valid,
  total_time,
}: RoutieValidationResultCardProps) => {
  const variant = valid ? 'available' : 'unavailable';
  return (
    <Card
      id="routie-validation-available-status-card"
      width="100%"
      variant={variant}
      height="5.4rem"
    >
      <Flex width="100%" gap={1.5} justifyContent="flex-start" height="100%">
        <img src={valid ? successIcon : failIcon} alt="available" />
        <Flex direction="column" gap={0.3} alignItems="flex-start">
          <Text variant="caption">
            {valid ? '일정 소화 가능' : '일정 소화 불가'}
          </Text>
          <Text variant="description">예상 소요 시간: {total_time}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutieValidationResultCard;
