import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

interface EditPlaceModalButtonsProps {
  onClose: () => void;
}

const EditPlaceModalButtons = ({ onClose }: EditPlaceModalButtonsProps) => {
  return (
    <Flex justifyContent="space-between" width="100%" gap={1.6}>
      <Button type="submit" variant="primary">
        <Flex width="100%">
          <Text variant="caption" color="white" onClick={onClose}>
            수정하기
          </Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default EditPlaceModalButtons;
