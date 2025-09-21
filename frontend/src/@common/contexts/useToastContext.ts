import { createContext, useContext } from 'react';

import type { ToastContextProps } from '../components/Toast/Toast.types';

const ToastContext = createContext<ToastContextProps>({
  toast: [],
  showToast: () => {},
});

const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }

  return context;
};

export { ToastContext, useToastContext };
