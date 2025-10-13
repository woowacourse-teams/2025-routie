import { useState } from 'react';

const useToggle = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, handleToggle };
};

export { useToggle };
