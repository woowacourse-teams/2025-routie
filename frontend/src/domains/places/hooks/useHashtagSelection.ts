import { useEffect, useState } from 'react';

const STORAGE_KEY = 'selectedHashtags';

const useHashtagSelection = (initialTags?: string[]) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialTags || [];
      }
    }
    return initialTags || [];
  });

  useEffect(() => {
    if (initialTags) {
      setSelectedTags(initialTags);
    }
  }, [initialTags]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTags));
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
