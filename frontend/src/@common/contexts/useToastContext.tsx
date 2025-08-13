import { createContext, useContext } from 'react';

import useToast from '../hooks/useToast';
import { ToastContextType } from '../types/toast.type';

const ToastContext = createContext<ToastContextType>({
  toast: [],
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast, showToast } = useToast();

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }

  return context;
};
