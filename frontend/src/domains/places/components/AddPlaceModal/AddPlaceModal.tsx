import Flex from '@/@common/components/Flex/Flex';
import IconButton from '@/@common/components/IconButton/IconButton';
import Modal from '@/@common/components/Modal/Modal';
import type { ModalProps } from '@/@common/components/Modal/Modal.types';
import Text from '@/@common/components/Text/Text';
import closeIcon from '@/assets/icons/close.svg';

import SearchBox from '../SearchBox/SearchBox';

const AddPlaceModal = ({ isOpen, onClose }: Omit<ModalProps, 'children'>) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Flex direction="column" width="44rem" gap={2}>
        <Flex justifyContent="space-between" width="100%">
          <Text variant="title2">장소 추가</Text>
          <IconButton type="button" icon={closeIcon} onClick={onClose} />
        </Flex>
        <Flex direction="column" alignItems="flex-start" width="100%" gap={2}>
          <SearchBox onClose={onClose} />
        </Flex>
      </Flex>
    </Modal>
  );
};

export default AddPlaceModal;
