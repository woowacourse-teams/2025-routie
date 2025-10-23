import { ReactNode, useState } from 'react';

import type {
  ModalStateType,
  ModalType,
} from '@/@common/components/Modal/Modal.types';

import { ModalContext } from './ModalContext';

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalStateType>({
    type: null,
    isOpen: false,
    props: undefined,
  });

  const openModal = (type: ModalType, props?: Record<string, any>) => {
    setModalState({
      type,
      isOpen: true,
      props,
    });
  };

  const closeModal = () => {
    setModalState({
      type: null,
      isOpen: false,
      props: undefined,
    });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
