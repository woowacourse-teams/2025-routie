import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';

import AddPlaceBasicInfo from './AddPlaceBasicInfo';
import AddPlaceModalHeader from './AddPlaceModalHeader';

const AddPlaceModal = ({ isOpen, onClose }: Omit<ModalProps, 'children'>) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Flex direction="column" width="44rem" gap={2}>
        <AddPlaceModalHeader onClose={onClose} />
        <AddPlaceBasicInfo onClose={onClose} />
      </Flex>
    </Modal>
  );
};

export default AddPlaceModal;
