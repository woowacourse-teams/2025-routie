import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';
import { useAddPlaceForm } from '@/domains/places/hooks/useAddPlaceForm';

import { getCheckedDaysInEnglish } from '../../utils/getCheckedDaysInEnglish';
import OptionalInfoSection from '../PlaceFormSection/OptionalInfoSection';
import RequiredInfoSection from '../PlaceFormSection/RequiredInfoSection';

import { ModalInputContainerStyle } from './AddPlaceModal.styles';
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

    const englishClosedDays = getCheckedDaysInEnglish(form.closedDays);

    // TODO: API 요청 로직 연결 예정
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
