import { useEffect, useState } from 'react';

import { sessionStorageUtils } from '@/@common/utils/sessionStorage';

const STORAGE_KEY = 'selectedHashtags';

const useHashtagSelection = (initialTags?: string[], useStorage = true) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (useStorage) {
      return sessionStorageUtils.get(STORAGE_KEY, initialTags || []);
    }
    return initialTags || [];
  });

  useEffect(() => {
    if (initialTags) {
      setSelectedTags(initialTags);
    }
  }, [initialTags]);

  useEffect(() => {
    if (useStorage) {
      sessionStorageUtils.set(STORAGE_KEY, selectedTags);
    }
  }, [selectedTags, useStorage]);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const resetSelectedTags = () => {
    setSelectedTags([]);
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [tag, ...prev]);
    }
  };

  return {
    selectedTags,
    handleToggleTag,
    resetSelectedTags,
    addTag,
  };
};

export { useHashtagSelection };
