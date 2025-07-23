import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Text from '@/@common/components/Text/Text';
import closeIcon from '@/assets/icons/close.svg';

interface EditPlaceModalHeaderProps {
  onClose: () => void;
}

const EditPlaceModalHeader = ({ onClose }: EditPlaceModalHeaderProps) => {
  return (
    <Flex justifyContent="space-between" width="100%">
      <Text variant="subTitle">장소 수정</Text>
      <IconButton type="button" icon={closeIcon} onClick={onClose}></IconButton>
    </Flex>
  );
};

export default EditPlaceModalHeader;
