import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import failIcon from '@/assets/icons/fail.svg';
import successIcon from '@/assets/icons/success.svg';

import { VALIDATION_RESULT_MESSAGE } from '../../constants/routieValidation';
import { useRoutieValidateContext } from '../../contexts/useRoutieValidateContext';

const RoutieValidationResultCard = () => {
  const { validationErrors } = useRoutieValidateContext();

  const isValidRoutie = validationErrors === null;
  const variant = isValidRoutie ? 'available' : 'unavailable';

  const resultMessage = validationErrors
    ? VALIDATION_RESULT_MESSAGE[validationErrors]
    : '일정 소화 가능';

  return (
    <Card
      id="routie-validation-available-status-card"
      width="100%"
      variant={variant}
      height="5.4rem"
    >
      <Flex width="100%" gap={1.5} justifyContent="flex-start" height="100%">
        <img src={isValidRoutie ? successIcon : failIcon} alt="available" />
        <Flex direction="column" gap={0.3} alignItems="flex-start">
          <Text variant="caption">{resultMessage}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutieValidationResultCard;
