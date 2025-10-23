import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalStyle, ModalOverlayStyle } from './Modal.style';

import type { ModalProps } from './Modal.types';

const Modal = ({ isOpen, onClose, children, closable = true }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closable) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEsc);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose, closable]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div onClick={closable ? onClose : undefined} css={ModalOverlayStyle} />
      <div css={ModalStyle}>{children}</div>
    </>,
    document.body,
  );
};

export default Modal;
