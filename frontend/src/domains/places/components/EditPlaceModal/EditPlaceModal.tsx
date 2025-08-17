import { useEffect, useRef, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';
import { useRoutieContext } from '@/domains/routie/contexts/useRoutieContext';

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
  const { routieIdList, refetchRoutieData } = useRoutieContext();
  const { isEmpty, isValid } = usePlaceFormValidation(form);
  const [showErrors, setShowErrors] = useState(false);
  const { showToast } = useToastContext();

  const initialFormRef = useRef<typeof form | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const initialData = await getPlace(id);
        initializeForm(initialData);
        initialFormRef.current = { ...initialData };
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

  const isFormChanged =
    JSON.stringify(form) !== JSON.stringify(initialFormRef.current);

  const placeInRoutie = routieIdList.includes(id);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      setShowErrors(true);

      return;
    }
    try {
      const { name, roadAddressName, ...rest } = form;

      await editPlace({ placeId: id, editableFields: rest });
      await onPlaceChange();

      if (placeInRoutie) {
        await refetchRoutieData();
      }
      showToast({
        message: '장소 정보가 수정되었습니다.',
        type: 'success',
      });
    } catch (error) {
      console.log(error);
      showToast({
        message: '장소 정보를 수정하지 못했습니다. 다시 시도해주세요.',
        type: 'error',
      });
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
                value={form.roadAddressName}
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
          <EditPlaceModalButtons disabled={!isFormChanged} />
        </Flex>
      </form>
    </Modal>
  );
};

export default EditPlaceModal;
