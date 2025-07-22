import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';
import { useAddPlaceForm } from '@/domains/places/hooks/useAddPlaceForm';

import OptionalInfoSection from '../PlaceFormSection/OptionalInfoSection';
import RequiredInfoSection from '../PlaceFormSection/RequiredInfoSection';

import { ModalInputContainer } from './AddPlaceModal.styles';
import AddPlaceModalButtons from './AddPlaceModalButtons';
import AddPlaceModalHeader from './AddPlaceModalHeader';

const AddPlaceModal = ({ isOpen, onClose }: Omit<ModalProps, 'children'>) => {
  const { form, handleInputChange, handleToggleDay, resetForm } =
    useAddPlaceForm();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" width="44rem" gap={2}>
          <AddPlaceModalHeader onClose={handleClose} />
          <div css={ModalInputContainer}>
            <RequiredInfoSection
              name={form.name}
              address={form.address}
              onChange={handleInputChange}
            />
          </div>
          <div css={ModalInputContainer}>
            <OptionalInfoSection
              form={form}
              onChange={handleInputChange}
              onToggleDay={handleToggleDay}
            />
          </div>
          <AddPlaceModalButtons onClose={handleClose} />
        </Flex>
      </form>
    </Modal>
  );
};

export default AddPlaceModal;
