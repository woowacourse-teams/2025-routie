import { useEffect } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';

import { useAddPlaceForm } from '../../hooks/useAddPlaceForm';
import { getCheckedDaysInEnglish } from '../../utils/getCheckedDaysInEnglish';
import { ModalInputContainerStyle } from '../AddPlaceModal/AddPlaceModal.styles';
import OptionalInfoSection from '../PlaceFormSection/OptionalInfoSection';
import { FormState } from '../PlaceFormSection/PlaceForm.types';
import RequiredInfoSection from '../PlaceFormSection/RequiredInfoSection';

import EditPlaceModalButtons from './EditPlaceModalButtons';
import EditPlaceModalHeader from './EditPlaceModalHeader';

interface EditPlaceModalProps extends Omit<ModalProps, 'children'> {
  initialData: FormState;
}

const EditPlaceModal = ({
  isOpen,
  onClose,
  initialData,
}: EditPlaceModalProps) => {
  const {
    form,
    initializeForm,
    handleInputChange,
    handleToggleDay,
    resetForm,
  } = useAddPlaceForm();

  useEffect(() => {
    if (isOpen) {
      initializeForm(initialData);
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const englishClosedDays = getCheckedDaysInEnglish(form.closedDays);

    // TODO: API 요청 로직 연결 예정. payload를 서버로 보낼것임
    const payload = {
      ...form,
      closedDays: englishClosedDays,
    };

    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" width="44rem" gap={2}>
          <EditPlaceModalHeader onClose={handleClose} />
          <div css={ModalInputContainerStyle}>
            <RequiredInfoSection
              name={form.name}
              address={form.address}
              onChange={handleInputChange}
              disabled={true}
            />
          </div>
          <div css={ModalInputContainerStyle}>
            <OptionalInfoSection
              form={form}
              onChange={handleInputChange}
              onToggleDay={handleToggleDay}
            />
          </div>
          <EditPlaceModalButtons />
        </Flex>
      </form>
    </Modal>
  );
};

export default EditPlaceModal;
