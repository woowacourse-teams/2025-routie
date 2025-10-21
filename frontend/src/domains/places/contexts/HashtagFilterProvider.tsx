import { useHashtagFilter } from '@/domains/places/hooks/useHashtagFilter';

import { HashtagFilterContext } from './useHashtagFilterContext';

const HashtagFilterProvider = ({ children }: { children: React.ReactNode }) => {

  const { selectedTags: selectedHashtags, handleToggleTag: updateHashtagSelection, handleSelectAll, resetSelectedTags } =
    useHashtagFilter();

  return (
    <HashtagFilterContext.Provider
      value={{
        selectedHashtags,
        updateHashtagSelection,
        handleSelectAll,
        resetSelectedTags,
      }}
    >
      {children}
    </HashtagFilterContext.Provider>
  );
};

export default HashtagFilterProvider;
