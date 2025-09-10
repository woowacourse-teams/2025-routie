import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Text from '@/@common/components/Text/Text';
import closeIcon from '@/assets/icons/close.svg';

const AddPlaceModalHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <Flex justifyContent="space-between" width="100%">
      <Text variant="title2">장소 추가</Text>
      <IconButton type="button" icon={closeIcon} onClick={onClose}></IconButton>
    </Flex>
  );
};

export default AddPlaceModalHeader;
