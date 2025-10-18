import { useState } from 'react';

const useToggle = (initialState: boolean = true) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, handleToggle };
};

export { useToggle };
