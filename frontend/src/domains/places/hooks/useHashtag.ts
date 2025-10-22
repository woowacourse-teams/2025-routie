import { useEffect, useState } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { addHashtagPrefix } from '@/@common/utils/format';
import { usePopularHashtagsQuery } from '@/domains/places/queries/usePlaceQuery';

import { useHashtagSelection } from './useHashtagSelection';

const useHashtag = (initialTags?: string[]) => {
  const MAX_TAG_LENGTH = 7;
  const MAX_TAGS = 5;

  const [inputValue, setInputValue] = useState('');
  const { selectedTags, handleToggleTag, resetSelectedTags, addTag } =
    useHashtagSelection(initialTags);
  const { data: popularHashtags, isError, error } = usePopularHashtagsQuery();
  const previousTags = popularHashtags || [];
  const { showToast } = useToastContext();

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

  const handleToggleTagWithLimit = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length >= MAX_TAGS) {
      showToast({
        message: `해시태그는 최대 ${MAX_TAGS}개까지 추가할 수 있습니다.`,
        type: 'info',
      });
      return;
    }
    handleToggleTag(tag);
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

    const formattedTag = addHashtagPrefix(trimmedTag);

    if (selectedTags.includes(formattedTag)) {
      showToast({
        message: '이미 등록된 해시태그입니다.',
        type: 'info',
      });
      return;
    }

    addTag(formattedTag);
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
    resetSelectedTags();
  };

  return {
    inputValue,
    selectedTags,
    previousTags,
    handleInputChange,
    handleAddTag,
    handleToggleTag: handleToggleTagWithLimit,
    handleEnterTag,
    handleReset,
  };
};

export { useHashtag };
