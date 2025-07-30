import { useCallback, useState } from 'react';

import deletePlace from '../apis/deletePlace';
import { PlaceCardProps } from '../components/PlaceCard/PlaceCard';

type usePlaceCardProps = Pick<PlaceCardProps, 'id' | 'onSelect' | 'onDelete'>;

export const usePlaceCard = ({ id, onSelect, onDelete }: usePlaceCardProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const openEditModal = useCallback(() => {
    setEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
  }, []);

  const handleToggle = useCallback(async () => {
    await onSelect();
  }, [onSelect]);

  const handleDelete = useCallback(async () => {
    try {
      await deletePlace(id);
      onDelete(id);
    } catch (error) {
      console.error('장소 삭제를 실패했습니다.', error);
    }
  }, [id, onDelete]);

  return {
    editModalOpen,
    openEditModal,
    closeEditModal,
    handleToggle,
    handleDelete,
  };
};
