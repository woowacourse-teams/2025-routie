import { useState } from 'react';

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return { openModal, closeModal, modalOpen };
};

export default useModal;
