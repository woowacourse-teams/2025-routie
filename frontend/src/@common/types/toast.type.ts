export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastInfoType = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  leaving?: boolean;
};

export type ShowToastPayload = {
  message: string;
  type: ToastType;
  duration?: number;
};

export type ToastContextType = {
  toast: ToastInfoType[];
  showToast: (payload: ShowToastPayload) => void;
};
