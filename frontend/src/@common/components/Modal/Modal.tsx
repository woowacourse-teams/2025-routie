import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalStyle, ModalOverlayStyle } from './Modal.style';

import type { ModalProps } from './Modal.types';

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.position = 'fixed';
      document.body.style.overflow = 'hidden';

      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEsc);

      return () => {
        document.body.style.position = '';
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

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
