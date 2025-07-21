import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalStyle, ModalOverlayStyle } from './Modal.style';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.position = 'fixed';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div onClick={onClose} css={ModalOverlayStyle} />
      <div css={ModalStyle}>{children}</div>
    </>,
    document.body,
  );
};

export default Modal;
