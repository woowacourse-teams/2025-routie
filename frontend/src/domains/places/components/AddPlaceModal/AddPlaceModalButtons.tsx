import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

interface AddPlaceModalButtonsProps {
  step: 1 | 2;
  isStep1Valid: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const AddPlaceModalButtons = ({
  step,
  isStep1Valid,
  onNext,
  onPrev,
}: AddPlaceModalButtonsProps) => {
  return (
    <Flex justifyContent="flex-end" gap={1} width="100%">
      {step === 1 ? (
        <Flex justifyContent="flex-end" width="50%">
          <Button
            variant="primary"
            onClick={onNext}
            disabled={!isStep1Valid}
            width="50%"
            type="button"
          >
            <Flex width="100%">
              <Text variant="caption" color={theme.colors.white}>
                다음
              </Text>
            </Flex>
          </Button>
        </Flex>
      ) : (
        <Flex width="50%" gap={1}>
          <Button variant="secondary" onClick={onPrev} type="button">
            <Flex width="100%">
              <Text variant="caption" color={theme.colors.purple[400]}>
                이전
              </Text>
            </Flex>
          </Button>
          <Button variant="primary" type="submit">
            <Flex width="100%">
              <Text variant="caption" color={theme.colors.white}>
                추가하기
              </Text>
            </Flex>
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default AddPlaceModalButtons;
