import { useState } from 'react';

import { HashtagFilterContext } from './useHashtagFilterContext';

const HashtagFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const updateHashtagSelection = (hashtag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(hashtag)
        ? prev.filter((tag) => tag !== hashtag)
        : [...prev, hashtag],
    );
  };

  return (
    <HashtagFilterContext.Provider value={{ selectedHashtags, updateHashtagSelection }}>
      {children}
    </HashtagFilterContext.Provider>
  );
};

export default HashtagFilterProvider;
