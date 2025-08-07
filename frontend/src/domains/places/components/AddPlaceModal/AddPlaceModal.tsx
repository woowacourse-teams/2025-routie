import { useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';
import { useAddPlaceForm } from '@/domains/places/hooks/useAddPlaceForm';

import addPlace from '../../apis/addPlace';
import { usePlaceFormValidation } from '../../hooks/usePlaceFormValidation';
import useSearchPlace from '../../hooks/useSearchPlace';
import AddressInput from '../PlaceFormSection/AddressInput';
import BreakTimeInputs from '../PlaceFormSection/BreakTimeInputs';
import BusinessHourInputs from '../PlaceFormSection/BusinessHourInputs';
import ClosedDaySelector from '../PlaceFormSection/ClosedDaySelector';
import PlaceNameInput from '../PlaceFormSection/PlaceNameInput';
import StayDurationInput from '../PlaceFormSection/StayDurationInput';
import SearchBox from '../SearchBox/SearchBox';

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
  const { isEmpty, isValid } = usePlaceFormValidation(form);
  const [showErrors, setShowErrors] = useState(false);
  const { placeLocation, handleSearchPlaceMap } = useSearchPlace();

  const handleClose = () => {
    resetForm();
    setShowErrors(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addPlaceForm = { ...form, ...placeLocation };

    if (!isValid) {
      setShowErrors(true);
      return;
    }
    try {
      await addPlace(addPlaceForm);
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
              <SearchBox
                onChange={handleInputChange}
                handleSearchPlaceMap={handleSearchPlaceMap}
              />
              {form.name && (
                <PlaceNameInput
                  value={form.name}
                  onChange={handleInputChange}
                  error={showErrors && isEmpty.name}
                  disabled
                />
              )}
              {form.roadAddressName && (
                <AddressInput
                  value={form.roadAddressName}
                  onChange={handleInputChange}
                  error={showErrors && isEmpty.roadAddressName}
                  disabled
                />
              )}
              <StayDurationInput
                value={form.stayDurationMinutes}
                onChange={handleInputChange}
                error={showErrors && isEmpty.stayDurationMinutes}
              />
              <BusinessHourInputs
                openAt={form.openAt}
                closeAt={form.closeAt}
                onChange={handleInputChange}
                error={{
                  openAt: showErrors && isEmpty.openAt,
                  closeAt: showErrors && isEmpty.closeAt,
                }}
              />
              <BreakTimeInputs
                breakStartAt={form.breakStartAt}
                breakEndAt={form.breakEndAt}
                onChange={handleInputChange}
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
