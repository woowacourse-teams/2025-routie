import { createContext } from 'react';

import useToast from '../hooks/useToast';
import { ToastContextType } from '../types/toast.type';

const ToastContext = createContext<ToastContextType>({
  toast: [],
  showToast: () => {},
});

export default ToastContext;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast, showToast } = useToast();

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};
