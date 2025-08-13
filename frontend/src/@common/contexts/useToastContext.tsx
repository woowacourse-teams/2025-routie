import { createContext } from 'react';

import useToast from '../hooks/useToast';
import { ToastContextType } from '../types/toast.type';

export const useToastContext = createContext<ToastContextType>({
  toast: [],
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast, showToast } = useToast();

  return (
    <useToastContext.Provider value={{ toast, showToast }}>
      {children}
    </useToastContext.Provider>
  );
};
