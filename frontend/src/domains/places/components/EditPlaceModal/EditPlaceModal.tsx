import { useEffect } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';

import editPlace from '../../apis/editPlace';
import getPlace from '../../apis/getPlace';
import { useAddPlaceForm } from '../../hooks/useAddPlaceForm';
import { ModalInputContainerStyle } from '../AddPlaceModal/AddPlaceModal.styles';
import OptionalInfoSection from '../PlaceFormSection/OptionalInfoSection';
import RequiredInfoSection from '../PlaceFormSection/RequiredInfoSection';

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
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { name, address, ...rest } = form;
      await editPlace({ placeId: id, editableFields: rest });
      await onPlaceChange();
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
