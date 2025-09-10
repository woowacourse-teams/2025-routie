import { useEffect, useRef, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';

import { editRoutieSpaceName, getRoutieSpace } from '../apis/routieSpace';
import { MAX_NAME_LENGTH, ERROR_MESSAGE } from '../constants/routieSpace';

import type {
  ERROR_CASE,
  UseRoutieSpaceNameReturn,
} from '../types/routieSpace.types';

const useRoutieSpaceName = (): UseRoutieSpaceNameReturn => {
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const errorCase = getErrorCase(name);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleClick = async () => {
    if (isEditing) {
      if (isLoading) return;

      try {
        if (errorCase) {
          showToast({
            message: ERROR_MESSAGE[errorCase],
            type: 'error',
          });

          inputRef.current?.focus();
          return;
        }

        if (originalName === name) {
          setIsEditing(false);
          return;
        }

        setIsLoading(true);

        const response = await editRoutieSpaceName(name);
        const displayName = response.name ?? '이름 못 찾음';

        setName(displayName);
        setOriginalName(displayName);
      } catch (error) {
        console.error('루티 스페이스 이름 수정 중 에러 발생:', error);
        if (error instanceof Error) {
          showToast({
            message: error.message,
            type: 'error',
          });
        }
        setName(originalName);
      } finally {
        setIsLoading(false);
      }
      setIsEditing(false);
    } else {
      setOriginalName(name);
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    const fetchRoutieSpaceName = async () => {
      try {
        const response = await getRoutieSpace();
        const displayName = response.name ?? '이름 못 찾음';

        setName(displayName);
        setOriginalName(displayName);
      } catch (error) {
        console.error('루티 스페이스 이름 불러오기 실패:', error);
        if (error instanceof Error) {
          showToast({
            message: error.message,
            type: 'error',
          });
        }
        setName('이름 못 찾음');
        setOriginalName('이름 못 찾음');
      }
    };

    fetchRoutieSpaceName();
  }, []);

  return {
    name,
    isEditing,
    isLoading,
    errorCase,
    inputRef,
    handleEnter,
    handleClick,
    handleChange,
  };
};

export { useRoutieSpaceName };
