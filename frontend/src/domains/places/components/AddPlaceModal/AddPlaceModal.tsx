import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';
import { useAddPlaceForm } from '@/domains/places/hooks/useAddPlaceForm';

import addPlace from '../../apis/addPlace';
import OptionalInfoSection from '../PlaceFormSection/OptionalInfoSection';
import RequiredInfoSection from '../PlaceFormSection/RequiredInfoSection';

import { ModalInputContainerStyle } from './AddPlaceModal.styles';
import AddPlaceModalButtons from './AddPlaceModalButtons';
import AddPlaceModalHeader from './AddPlaceModalHeader';

interface AddPlaceModalProps extends Omit<ModalProps, 'children'> {
  onPlaceAdded?: () => Promise<void>;
}

const AddPlaceModal = ({
  isOpen,
  onClose,
  onPlaceAdded,
}: AddPlaceModalProps) => {
  const { form, handleInputChange, handleToggleDay, resetForm } =
    useAddPlaceForm();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addPlace(form);
      if (onPlaceAdded) {
        await onPlaceAdded();
      }
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" width="44rem" gap={2}>
          <AddPlaceModalHeader onClose={handleClose} />
          <div css={ModalInputContainerStyle}>
            <RequiredInfoSection
              name={form.name}
              address={form.address}
              onChange={handleInputChange}
            />
          </div>
          <div css={ModalInputContainerStyle}>
            <OptionalInfoSection
              form={form}
              onChange={handleInputChange}
              onToggleDay={handleToggleDay}
            />
          </div>
          <AddPlaceModalButtons />
        </Flex>
      </form>
    </Modal>
  );
};

export default AddPlaceModal;
