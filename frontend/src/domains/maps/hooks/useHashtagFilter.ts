import { useEffect, useRef } from 'react';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { useHashtagFilterContext } from '@/domains/places/contexts/useHashtagFilterContext';
import { useHashtagsQuery } from '@/domains/places/queries/usePlaceQuery';

const useHashtagFilter = () => {
  const MAX_VISIBLE_HASHTAGS = 7;

  const visibleHashtagsRef = useRef<HTMLDivElement>(null);
  const { selectedHashtags, updateHashtagSelection, handleSelectAll, resetSelectedTags } =
    useHashtagFilterContext();
  const { showToast } = useToastContext();

  const { data: hashtagsData, isError, error } = useHashtagsQuery();
  const hashtags = hashtagsData?.hashtags || [];

  useEffect(() => {
    if (isError) {
      showToast({
        message: error?.message || '해시태그를 불러오는데 실패했습니다.',
        type: 'error',
      });
    }
  }, [isError, error, showToast]);

  const visibleHashtags = hashtags.slice(0, MAX_VISIBLE_HASHTAGS);
  const hiddenHashtags = hashtags.slice(MAX_VISIBLE_HASHTAGS);

  const handleHashtagClick = (hashtag: string) => {
    updateHashtagSelection(hashtag);
  };

  const isAllSelected = hashtags.length > 0 && selectedHashtags.length === hashtags.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      resetSelectedTags();
    } else {
      handleSelectAll(hashtags);
    }
  };

  return {
    visibleHashtagsRef,
    selectedHashtags,
    hashtags,
    visibleHashtags,
    hiddenHashtags,
    handleHashtagClick,
    isAllSelected,
    handleToggleSelectAll,
  };
};

export { useHashtagFilter };
