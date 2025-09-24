import type { ModalProps } from '@/@common/components/Modal/Modal.types';
import ModalLayout from '@/@common/components/ModalLayout/ModalLayout';
import SearchBox from '@/domains/places/components/SearchBox/SearchBox';

const AddPlaceModal = ({ onClose }: Pick<ModalProps, 'onClose'>) => {
  return (
    <ModalLayout title="장소 추가" onClose={onClose}>
      <SearchBox onClose={onClose} />
    </ModalLayout>
  );
};

export default AddPlaceModal;
