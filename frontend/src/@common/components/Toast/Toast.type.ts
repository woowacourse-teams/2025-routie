type ToastVariantType = 'success' | 'error' | 'warning' | 'info';

interface ToastInfoProps {
  id: string;
  message: string;
  type: ToastVariantType;
  duration: number;
  leaving?: boolean;
}

interface ShowToastPayloadProps {
  message: string;
  type: ToastVariantType;
  duration?: number;
}

interface ToastContextProps {
  toast: ToastInfoProps[];
  showToast: (payload: ShowToastPayloadProps) => void;
}

export type {
  ToastVariantType,
  ToastInfoProps,
  ShowToastPayloadProps,
  ToastContextProps,
};
