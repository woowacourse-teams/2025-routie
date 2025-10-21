import { useEffect, useState } from 'react';

import { sessionStorageUtils } from '@/@common/utils/sessionStorage';

const STORAGE_KEY = 'selectedHashtags';

const useHashtagFilter = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    return sessionStorageUtils.get(STORAGE_KEY, []);
  });

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

  return {
    selectedTags,
    handleToggleTag,
    resetSelectedTags,
  };
};

export { useHashtagFilter };
