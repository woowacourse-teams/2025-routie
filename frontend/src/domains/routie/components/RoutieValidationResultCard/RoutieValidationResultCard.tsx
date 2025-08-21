import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';

import { VALIDATION_RESULT_MESSAGE } from '../../constants/routieValidation';
import { useRoutieValidateContext } from '../../contexts/useRoutieValidateContext';

const RoutieValidationResultCard = () => {
  const { validationErrors } = useRoutieValidateContext();

  const isValidRoutie = validationErrors === null;
  const variant = isValidRoutie ? 'valid' : 'unavailable';

  const resultMessage = validationErrors
    ? VALIDATION_RESULT_MESSAGE[validationErrors]
    : '일정 소화 가능';

  return (
    <Card
      id="routie-validation-available-status-card"
      variant={variant}
      height="5.4rem"
    >
      <Flex width="100%" gap={1.5} justifyContent="flex-start" height="100%">
        <Icon name={isValidRoutie ? 'success' : 'fail'} size={28} />
        <Flex alignItems="flex-start">
          <Text variant="caption">{resultMessage}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RoutieValidationResultCard;
