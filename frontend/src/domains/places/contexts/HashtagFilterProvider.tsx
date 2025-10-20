import { useHashtagSelection } from '@/domains/places/hooks/useHashtagSelection';

import { HashtagFilterContext } from './useHashtagFilterContext';

const HashtagFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    selectedTags: selectedHashtags,
    handleToggleTag: updateHashtagSelection,
    handleSelectAll,
    resetSelectedTags,
  } = useHashtagSelection();

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
