import Modal from '@/@common/components/Modal/Modal';
import { useModal } from '@/@common/contexts/ModalContext';
import AddPlaceModal from '@/domains/places/components/AddPlaceModal/AddPlaceModal';

const ModalManager = () => {
  const { modalState, closeModal } = useModal();

  const renderModalContent = () => {
    switch (modalState.type) {
      case 'addPlace':
        return <AddPlaceModal onClose={closeModal} {...modalState.props} />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={modalState.isOpen} onClose={closeModal}>
      {renderModalContent()}
    </Modal>
  );
};

export default ModalManager;
