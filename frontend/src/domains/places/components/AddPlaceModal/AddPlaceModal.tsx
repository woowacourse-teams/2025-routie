import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';
import { useAddPlaceForm } from '@/domains/places/hooks/useAddPlaceForm';

import addPlace from '../../apis/addPlace';
import AddressInput from '../PlaceFormSection/AddressInput';
import BreakTimeInputs from '../PlaceFormSection/BreakTimeInputs';
import BusinessHourInputs from '../PlaceFormSection/BusinessHourInputs';
import ClosedDaySelector from '../PlaceFormSection/ClosedDaySelector';
import PlaceNameInput from '../PlaceFormSection/PlaceNameInput';
import StayDurationInput from '../PlaceFormSection/StayDurationInput';

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
            <Flex
              direction="column"
              alignItems="flex-start"
              width="100%"
              gap={2}
            >
              <PlaceNameInput
                value={form.name}
                onChange={handleInputChange}
                required={true}
              />
              <AddressInput
                value={form.address}
                onChange={handleInputChange}
                required={true}
              />
              <StayDurationInput
                value={form.stayDurationMinutes}
                onChange={handleInputChange}
                required={true}
              />
              <BusinessHourInputs
                openAt={form.openAt}
                closeAt={form.closeAt}
                onChange={handleInputChange}
                required={true}
              />
              <BreakTimeInputs
                breakStartAt={form.breakStartAt}
                breakEndAt={form.breakEndAt}
                onChange={handleInputChange}
                required={false}
              />
              <ClosedDaySelector
                closedDayOfWeeks={form.closedDayOfWeeks}
                onToggleDay={handleToggleDay}
              />
            </Flex>
          </div>
          <AddPlaceModalButtons />
        </Flex>
      </form>
    </Modal>
  );
};

export default AddPlaceModal;
