import { createContext, useContext } from 'react';

import type { ModalContextProps } from '@/@common/components/Modal/Modal.types';

const ModalContext = createContext<ModalContextProps | null>(null);

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export { ModalContext, useModal };
