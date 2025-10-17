import { useState } from 'react';

const useToggle = (initialState: boolean = true, storageKey?: string) => {
  const getInitialState = () => {
    if (storageKey) {
      const storedValue = localStorage.getItem(storageKey);
      if (storedValue !== null) {
        return storedValue === 'true';
      }
    }
    return initialState;
  };

  const [isOpen, setIsOpen] = useState(getInitialState);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const newValue = !prev;
      if (storageKey) {
        localStorage.setItem(storageKey, String(newValue));
      }
      return newValue;
    });
  };

  return { isOpen, handleToggle };
};

export { useToggle };
