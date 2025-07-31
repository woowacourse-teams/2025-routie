import { useCallback, useState } from 'react';

export const usePlaceCardEditModal = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const openEditModal = useCallback(() => {
    setEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
  }, []);

  return { openEditModal, closeEditModal, editModalOpen };
};
