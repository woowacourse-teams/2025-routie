import { useHashtagFilter } from '@/domains/places/hooks/useHashtagFilter';

import { HashtagFilterContext } from './useHashtagFilterContext';

const HashtagFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const { selectedTags: selectedHashtags, handleToggleTag: updateHashtagSelection } =
    useHashtagFilter();

  return (
    <HashtagFilterContext.Provider value={{ selectedHashtags, updateHashtagSelection }}>
      {children}
    </HashtagFilterContext.Provider>
  );
};

export default HashtagFilterProvider;
