import { useEffect, useState } from 'react';

import { sessionStorageUtils } from '@/@common/utils/sessionStorage';

const STORAGE_KEY = 'selectedHashtags';

const useHashtagSelection = (initialTags?: string[]) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    return sessionStorageUtils.get(STORAGE_KEY, initialTags || []);
  });

  useEffect(() => {
    if (initialTags) {
      setSelectedTags(initialTags);
    }
  }, [initialTags]);

  useEffect(() => {
    sessionStorageUtils.set(STORAGE_KEY, selectedTags);
  }, [selectedTags]);

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
