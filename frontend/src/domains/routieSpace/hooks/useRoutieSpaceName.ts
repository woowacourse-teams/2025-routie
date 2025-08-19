import { useEffect, useRef, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';

import {
  editRoutieSpaceName,
  getRoutieSpaceName,
} from '../apis/routieSpaceName';

const MAX_NAME_LENGTH = 15;
const ERROR_MESSAGE = {
  noName: '루티 스페이스 이름은 비어있을 수 없습니다.',
  invalidNameLength: '루티 스페이스 이름은 15자 이하여야 합니다.',
} as const;

type ERROR_CASE = keyof typeof ERROR_MESSAGE;

interface UseRoutieSpaceNameReturn {
  name: string;
  isEditing: boolean;
  isLoading: boolean;
  errorCase: ERROR_CASE | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClick: () => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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

        const updatedName = await editRoutieSpaceName(name);
        const displayName = updatedName ?? '이름 못 찾음';

        setName(displayName);
        setOriginalName(displayName);
      } catch (error) {
        console.error('루티 스페이스 이름 수정 중 에러 발생:', error);
        showToast({
          message: '이름 수정에 실패했습니다. 다시 시도해주세요.',
          type: 'error',
        });
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
        const name = await getRoutieSpaceName();
        const displayName = name ?? '이름 못 찾음';

        setName(displayName);
        setOriginalName(displayName);
      } catch (error) {
        console.error('루티 스페이스 이름 불러오기 실패:', error);
        showToast({
          message: '이름을 불러오는데 실패했습니다.',
          type: 'error',
        });
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

export default useRoutieSpaceName;
