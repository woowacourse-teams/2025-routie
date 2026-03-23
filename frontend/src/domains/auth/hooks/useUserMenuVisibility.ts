import { useEffect, useRef, useState } from 'react';

const useUserMenuVisibility = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuTriggerButtonRef = useRef<HTMLButtonElement>(null);

  const closeUserMenu = (shouldRestoreFocus = false) => {
    setIsUserMenuOpen(false);

    if (shouldRestoreFocus) {
      userMenuTriggerButtonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        closeUserMenu();
      }
    };

    const handleEscapeKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeUserMenu(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [isUserMenuOpen]);

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  return {
    isUserMenuOpen,
    userMenuRef,
    userMenuTriggerButtonRef,
    toggleUserMenu,
    closeUserMenu,
  };
};

export { useUserMenuVisibility };
