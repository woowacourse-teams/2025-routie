import { useEffect, useRef } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useToggle } from '@/@common/hooks/useToggle';
import { useHashtagFilterContext } from '@/domains/maps/contexts/useHashtagFilterContext';
import Hashtag from '@/domains/places/components/Hashtag/Hashtag';
import { useHashtagsQuery } from '@/domains/places/queries/usePlaceQuery';

import {
  ButtonContainerStyle,
  HashtagsContainerStyle,
  DropdownWrapperStyle,
  DropdownButtonStyle,
  DropdownContentStyle,
} from './HashtagFilter.styles';

import type { HashtagFilterProps } from './HashtagFilter.types';

const HashtagFilter = ({ isSidebarOpen }: HashtagFilterProps) => {
  const visibleHashtagsRef = useRef<HTMLDivElement>(null);
  const { selectedHashtags, updateHashtagSelection } = useHashtagFilterContext();
  const { isOpen: isDropdownOpen, handleToggle: handleDropdownToggle } = useToggle(false);
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

  const MAX_VISIBLE_HASHTAGS = 7;
  const visibleHashtags = hashtags.slice(0, MAX_VISIBLE_HASHTAGS);
  const hiddenHashtags = hashtags.slice(MAX_VISIBLE_HASHTAGS);

  const handleHashtagClick = (hashtag: string) => {
    updateHashtagSelection(hashtag);
  };

  if (hashtags.length === 0) return null;

  return (
    <Flex width="auto" gap={0.8} css={ButtonContainerStyle(isSidebarOpen)}>
      <div ref={visibleHashtagsRef} css={HashtagsContainerStyle}>
        {visibleHashtags.map((hashtag) => (
          <Hashtag
            key={hashtag}
            tag={hashtag}
            isSelected={selectedHashtags.includes(hashtag)}
            onClick={() => handleHashtagClick(hashtag)}
          />
        ))}
      </div>
      {hiddenHashtags.length > 0 && (
        <div css={DropdownWrapperStyle}>
          <Button
            variant="secondary"
            onClick={handleDropdownToggle}
            css={DropdownButtonStyle(isDropdownOpen)}
          >
            +{hiddenHashtags.length}
          </Button>
          <Flex
            direction="column"
            gap={0.4}
            css={DropdownContentStyle(isDropdownOpen)}
          >
            {hiddenHashtags.map((hashtag) => (
              <Hashtag
                key={hashtag}
                tag={hashtag}
                isSelected={selectedHashtags.includes(hashtag)}
                onClick={() => handleHashtagClick(hashtag)}
              />
            ))}
          </Flex>
        </div>
      )}
    </Flex>
  );
};

export default HashtagFilter;
