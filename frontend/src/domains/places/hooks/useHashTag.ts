import { useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';

const useHashTag = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previousTags] = useState<string[]>(['#맛집', '#카페', '#데이트코스']);

  const { showToast } = useToastContext();
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= MAX_TAGS) {
        showToast({
          message: `해시태그는 최대 ${MAX_TAGS}개까지 추가할 수 있습니다.`,
          type: 'info',
        });
        return;
      }
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const MAX_TAGS = 5;

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (selectedTags.length >= MAX_TAGS) {
      showToast({
        message: `해시태그는 최대 ${MAX_TAGS}개까지 추가할 수 있습니다.`,
        type: 'info',
      });
      return;
    }

    const formattedTag = trimmedTag.startsWith('#')
      ? trimmedTag
      : `#${trimmedTag}`;

    if (selectedTags.includes(formattedTag)) {
      showToast({
        message: '이미 등록된 해시태그입니다.',
        type: 'info',
      });
      return;
    }

    setSelectedTags((prev) => [formattedTag, ...prev]);
    setInputValue('');
  };

  const handleEnterTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setSelectedTags([]);
  };

  return {
    inputValue,
    selectedTags,
    previousTags,
    handleInputChange,
    handleAddTag,
    handleToggleTag,
    handleEnterTag,
    handleReset,
  };
};

export default useHashTag;
