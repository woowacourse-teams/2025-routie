import { useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Modal, { ModalProps } from '@/@common/components/Modal/Modal';
import Text from '@/@common/components/Text/Text';
import { useAddPlaceForm } from '@/domains/places/hooks/useAddPlaceForm';
import { usePlaceFormValidation } from '@/domains/places/hooks/usePlaceFormValidation';

import addPlace from '../../apis/addPlace';
import { useFunnel } from '../../hooks/useFunnel';
import { PlaceLocationType } from '../../types/place.types';

import AddPlaceBasicInfo from './AddPlaceBasicInfo';
import { ModalInputContainerStyle } from './AddPlaceModal.styles';
import AddPlaceModalButtons from './AddPlaceModalButtons';
import AddPlaceModalHeader from './AddPlaceModalHeader';
import AddPlaceVerification from './AddPlaceVerification';

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
  const { step, nextStep, prevStep, resetFunnel } = useFunnel();

  const [showErrors, setShowErrors] = useState(false);
  const [placeLocationInfo, setPlaceLocationInfo] =
    useState<PlaceLocationType>();

  const isStep1Valid =
    !isEmpty.name && !isEmpty.roadAddressName && !isEmpty.stayDurationMinutes;

  const handleClose = () => {
    resetForm();
    resetFunnel();
    setShowErrors(false);
    onClose();
  };

  const handleSearchPlaceMap = (placeLocation: PlaceLocationType) => {
    setPlaceLocationInfo(placeLocation);
  };

  const handleNext = () => {
    if (!isStep1Valid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    nextStep();
  };

  const handlePrev = () => {
    setShowErrors(false);
    prevStep();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addPlaceForm = { ...form, ...placeLocationInfo };

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

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <AddPlaceBasicInfo
            form={form}
            isEmpty={isEmpty}
            showErrors={showErrors}
            handleInputChange={handleInputChange}
            handleSearchPlaceMap={handleSearchPlaceMap}
          />
        );
      case 2:
        return (
          <AddPlaceVerification
            form={form}
            isEmpty={isEmpty}
            showErrors={showErrors}
            handleInputChange={handleInputChange}
            handleToggleDay={handleToggleDay}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" width="44rem" gap={2}>
          <AddPlaceModalHeader onClose={handleClose} />
          <Flex justifyContent="flex-start" gap={1.6} width="100%">
            <Text variant="caption" css={step === 1 && { fontWeight: 700 }}>
              1. 기본 정보
            </Text>
            <Text variant="caption" css={step === 2 && { fontWeight: 700 }}>
              2. 검증 정보
            </Text>
          </Flex>
          <div css={ModalInputContainerStyle}>{renderContent()}</div>
          <AddPlaceModalButtons
            step={step}
            isStep1Valid={isStep1Valid}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </Flex>
      </form>
    </Modal>
  );
};

export default AddPlaceModal;
