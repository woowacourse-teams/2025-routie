import { useEffect } from 'react';
import { useLocation } from 'react-router';

import Modal from '@/@common/components/Modal/Modal';
import { useModal } from '@/@common/contexts/ModalContext';
import LoginModal from '@/domains/auth/components/LoginModal/LoginModal';
import SocialLoginModal from '@/domains/auth/components/LoginModal/SocialLoginModal';

const ModalManager = () => {
  const { modalState, closeModal } = useModal();
  const location = useLocation();

  useEffect(() => {
    if (modalState.isOpen) {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const renderModalContent = () => {
    switch (modalState.type) {
      case 'login':
        return <LoginModal onClose={closeModal} {...modalState.props} />;
      case 'socialLogin':
        return <SocialLoginModal onClose={closeModal} {...modalState.props} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      closable={modalState.type !== 'login'}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default ModalManager;
