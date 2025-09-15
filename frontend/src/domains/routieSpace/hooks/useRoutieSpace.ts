import { useEffect, useRef, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';

import { MAX_NAME_LENGTH, ERROR_MESSAGE } from '../constants/routieSpace';
import {
  useEditRoutieSpaceNameQuery,
  useRoutieSpaceQuery,
} from '../queries/useRoutieSpaceQuery';

import type {
  ERROR_CASE,
  UseRoutieSpaceReturn,
} from '../types/routieSpace.types';

const useRoutieSpace = (): UseRoutieSpaceReturn => {
  const { data: routieSpace, isLoading } = useRoutieSpaceQuery();
  const [currentName, setCurrentName] = useState('');
  const { mutateAsync: editRoutieSpaceName } =
    useEditRoutieSpaceNameQuery(currentName);
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToastContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const getErrorCase = (name: string): ERROR_CASE | null => {
    if (name === '') {
      return 'noName';
    }
    if (name.length > MAX_NAME_LENGTH) {
      return 'invalidNameLength';
    }

    return null;
  };

  const errorCase = getErrorCase(currentName);

  const validateNameEdit = (): boolean => {
    if (errorCase) {
      showToast({
        message: ERROR_MESSAGE[errorCase],
        type: 'error',
      });
      inputRef.current?.focus();
      return false;
    }

    return true;
  };

  const hasNameChanged = (): boolean => {
    return currentName !== (routieSpace?.name ?? '');
  };

  const saveNameEdit = async (): Promise<void> => {
    await editRoutieSpaceName();
    setIsEditing(false);
  };

  const handleSaveNameEdit = async () => {
    if (isLoading) return;

    if (!validateNameEdit()) return;

    if (!hasNameChanged()) {
      setIsEditing(false);
      return;
    }

    await saveNameEdit();
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      if (isEditing) {
        e.preventDefault();

        await handleSaveNameEdit();
      }
    }
  };

  const handleClick = async () => {
    if (isEditing) {
      await handleSaveNameEdit();
    } else {
      setCurrentName(routieSpace?.name ?? '');
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentName(e.target.value);
  };

  useEffect(() => {
    if (!isEditing) {
      setCurrentName(routieSpace?.name ?? '');
    }
  }, [routieSpace?.name, isEditing]);

  return {
    name: currentName,
    isEditing,
    isLoading,
    errorCase,
    inputRef,
    handleEnter,
    handleClick,
    handleChange,
  };
};

export { useRoutieSpace };
