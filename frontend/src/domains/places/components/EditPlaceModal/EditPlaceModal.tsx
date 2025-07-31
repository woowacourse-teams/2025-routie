import { useEffect, useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';
import { useRoutieValidateContext } from '@/domains/routie/contexts/useRoutieValidateContext';

import editPlace from '../../apis/editPlace';
import getPlace from '../../apis/getPlace';
import { useAddPlaceForm } from '../../hooks/useAddPlaceForm';
import { usePlaceFormValidation } from '../../hooks/usePlaceFormValidation';
import { ModalInputContainerStyle } from '../AddPlaceModal/AddPlaceModal.styles';
import AddressInput from '../PlaceFormSection/AddressInput';
import BreakTimeInputs from '../PlaceFormSection/BreakTimeInputs';
import BusinessHourInputs from '../PlaceFormSection/BusinessHourInputs';
import ClosedDaySelector from '../PlaceFormSection/ClosedDaySelector';
import PlaceNameInput from '../PlaceFormSection/PlaceNameInput';
import StayDurationInput from '../PlaceFormSection/StayDurationInput';

import EditPlaceModalButtons from './EditPlaceModalButtons';
import EditPlaceModalHeader from './EditPlaceModalHeader';

interface EditPlaceModalProps extends Omit<ModalProps, 'children'> {
  id: number;
  onPlaceChange: () => Promise<void>;
}

const EditPlaceModal = ({
  isOpen,
  onClose,
  id,
  onPlaceChange,
}: EditPlaceModalProps) => {
  const {
    form,
    initializeForm,
    handleInputChange,
    handleToggleDay,
    resetForm,
  } = useAddPlaceForm();
  const { validateRoutie } = useRoutieValidateContext();
  const { isEmpty, isValid } = usePlaceFormValidation(form);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const initialData = await getPlace(id);
        initializeForm(initialData);
      } catch (error) {
        console.error('장소 데이터 조회 실패:', error);
      }
    };

    fetchData();
  }, [isOpen, id]);

  const handleClose = () => {
    resetForm();
    setShowErrors(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      setShowErrors(true);

      return;
    }
    try {
      const { name, address, ...rest } = form;

      await editPlace({ placeId: id, editableFields: rest });
      await onPlaceChange();
      await validateRoutie();
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" width="44rem" gap={2}>
          <EditPlaceModalHeader onClose={handleClose} />
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
                disabled={true}
              />
              <AddressInput
                value={form.address}
                onChange={handleInputChange}
                disabled={true}
              />
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
          <EditPlaceModalButtons />
        </Flex>
      </form>
    </Modal>
  );
};

export default EditPlaceModal;
