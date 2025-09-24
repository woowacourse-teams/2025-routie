interface ModalLayoutProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
  width?: string;
}

export type { ModalLayoutProps };
