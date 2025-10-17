import { useEffect, useState } from 'react';

const useHashtagSelection = (initialTags?: string[]) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags || []);

  useEffect(() => {
    if (initialTags) {
      setSelectedTags(initialTags);
    }
  }, [initialTags]);

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
