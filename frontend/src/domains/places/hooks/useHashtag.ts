import { useEffect, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useHashtagsQuery } from '@/domains/places/queries/usePlaceQuery';

const useHashtag = (initialTags?: string[]) => {
  const MAX_TAG_LENGTH = 7;
  const MAX_TAGS = 5;

  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags || []);
  const { data: hashtagsData, isError, error } = useHashtagsQuery();
  const previousTags = hashtagsData?.hashtags || [];
  const { showToast } = useToastContext();

  useEffect(() => {
    if (initialTags) {
      setSelectedTags(initialTags);
    }
  }, [initialTags]);

  useEffect(() => {
    if (isError) {
      showToast({
        message: error?.message || '해시태그를 불러오는데 실패했습니다.',
        type: 'error',
      });
    }
  }, [isError, error, showToast]);

  const handleInputChange = (value: string) => {
    const hashtagWithoutHash = value.startsWith('#') ? value.slice(1) : value;
    if (hashtagWithoutHash.length > MAX_TAG_LENGTH) {
      return;
    }
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
      ? trimmedTag.slice(1)
      : trimmedTag;

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

export { useHashtag };
