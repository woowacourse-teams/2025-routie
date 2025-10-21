import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useToggle } from '@/@common/hooks/useToggle';
import { useHashtagFilter } from '@/domains/maps/hooks/useHashtagFilter';
import Hashtag from '@/domains/places/components/Hashtag/Hashtag';

import {
  ButtonStyle,
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
    handleHashtagClick,
    isAllSelected,
    handleToggleSelectAll,
  } = useHashtagFilter();
  const { isOpen: isDropdownOpen, handleToggle: handleDropdownToggle } =
    useToggle(false);

  if (hashtags.length === 0) return null;

  return (
    <Flex width="auto" gap={0.8} css={ButtonContainerStyle(isSidebarOpen)}>
      <div ref={visibleHashtagsRef} css={HashtagsContainerStyle}>
        <Button
          variant={isAllSelected ? 'primary' : 'secondary'}
          width="auto"
          onClick={handleToggleSelectAll}
          css={ButtonStyle(isAllSelected)}
        >
          <Icon name={isAllSelected ? 'allUnselect' : 'allSelect'} size={20} />
          <Text variant="body" color={isAllSelected ? 'white' : undefined}>
            {isAllSelected ? '전체 해제' : '전체 선택'}
          </Text>
        </Button>
        {visibleHashtags.map((hashtag) => (
          <Hashtag
            key={hashtag}
            tag={hashtag}
            isSelected={selectedHashtags.includes(hashtag)}
            onClick={() => handleHashtagClick(hashtag)}
          />
        ))}
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
              padding={0.8}
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
      </div>
    </Flex>
  );
};

export default HashtagFilter;
