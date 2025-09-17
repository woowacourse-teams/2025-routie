import { useToast } from '../hooks/useToast';

import { ToastContext } from './useToastContext';

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast, showToast } = useToast();

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
