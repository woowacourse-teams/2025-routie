import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

interface AddPlaceModalButtonsProps {
  onClose: () => void;
}

const AddPlaceModalButtons = ({ onClose }: AddPlaceModalButtonsProps) => {
  return (
    <Flex justifyContent="space-between" width="100%" gap={1.6}>
      <Button type="button" variant="secondary">
        <Flex width="100%">
          <Text variant="caption" color="purple" onClick={onClose}>
            닫기
          </Text>
        </Flex>
      </Button>
      <Button type="submit" variant="primary">
        <Flex width="100%">
          <Text variant="caption" color="white">
            추가하기
          </Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default AddPlaceModalButtons;
