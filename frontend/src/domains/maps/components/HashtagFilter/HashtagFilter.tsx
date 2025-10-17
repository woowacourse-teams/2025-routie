import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import { useHashtagFilter } from '@/domains/maps/hooks/useHashtagFilter';
import Hashtag from '@/domains/places/components/Hashtag/Hashtag';

import {
  ButtonContainerStyle,
  HashtagsContainerStyle,
  DropdownWrapperStyle,
  DropdownButtonStyle,
  DropdownContentStyle,
} from './HashtagFilter.styles';

import type { HashtagFilterProps } from './HashtagFilter.types';

const HashtagFilter = ({ isSidebarOpen }: HashtagFilterProps) => {
  const {
    visibleHashtagsRef,
    selectedHashtags,
    hashtags,
    visibleHashtags,
    hiddenHashtags,
    isDropdownOpen,
    handleDropdownToggle,
    handleHashtagClick,
  } = useHashtagFilter();

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
