interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closable?: boolean;
}

type ModalType = 'login' | 'addPlace' | 'socialLogin';

interface ModalStateType {
  type: ModalType | null;
  isOpen: boolean;
  props?: Record<string, any>;
}

interface ModalContextProps {
  modalState: ModalStateType;
  openModal: (type: ModalType, props?: Record<string, any>) => void;
  closeModal: () => void;
}

export type { ModalProps, ModalType, ModalStateType, ModalContextProps };
