import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useToggle } from '@/@common/hooks/useToggle';
import { useHashtagFilter } from '@/domains/maps/hooks/useHashtagFilter';
import Hashtag from '@/domains/places/components/Hashtag/Hashtag';
import { useDeleteHashtagMutation } from '@/domains/places/queries/usePlaceQuery';

import {
  ButtonContainerStyle,
  HashtagsContainerStyle,
  ButtonStyle,
  DropdownWrapperStyle,
  DropdownButtonStyle,
  DropdownContentStyle,
} from './HashtagFilter.styles';

import type { HashtagFilterProps } from './HashtagFilter.types';

const HashtagFilter = ({ isSidebarOpen }: HashtagFilterProps) => {
  const {
    selectedHashtags,
    hashtags,
    hashtagsWithCount,
    visibleHashtags,
    hiddenHashtags,
    handleHashtagClick,
    isAllSelected,
    handleToggleSelectAll,
  } = useHashtagFilter();
  const { isOpen: isDropdownOpen, handleToggle: handleDropdownToggle } =
    useToggle(false);
  const { isOpen: isEditMode, handleToggle: toggleEditMode } = useToggle(false);
  const { mutate: deleteHashtag } = useDeleteHashtagMutation();

  const handleDeleteHashtag = (hashtagId: number) => {
    const confirmed = confirm(
      '정말로 이 해시태그를 삭제하시겠습니까?\n삭제 시, 모든 장소에서 해당 해시태그가 삭제됩니다.',
    );
    if (!confirmed) return;

    deleteHashtag({ hashtagId });
  };

  if (hashtags.length === 0) return null;

  return (
    <div css={ButtonContainerStyle(isSidebarOpen)}>
      <Flex direction="column" alignItems="flex-start" gap={1}>
        <Flex
          direction="column"
          justifyContent="flex-start"
          gap={0.8}
          css={[HashtagsContainerStyle]}
        >
          <Button
            variant={isAllSelected ? 'primary' : 'secondary'}
            width="auto"
            radius="lg"
            padding="1rem"
            onClick={handleToggleSelectAll}
            css={ButtonStyle(isAllSelected)}
            disabled={isEditMode}
          >
            <Icon
              name={isAllSelected ? 'allUnselect' : 'allSelect'}
              size={20}
            />
            <Text variant="caption" color={isAllSelected ? 'white' : undefined}>
              {isAllSelected ? '전체 해제' : '전체 선택'}
            </Text>
          </Button>
          <Flex gap={1} alignItems="flex-start" width="auto">
            {visibleHashtags.map((hashtag) => {
              const hashtagData = hashtagsWithCount.find(
                (h) => h.name === hashtag,
              );
              return (
                <Hashtag
                  key={hashtag}
                  tag={hashtag}
                  isSelected={selectedHashtags.includes(hashtag)}
                  onClick={() => handleHashtagClick(hashtag)}
                  count={hashtagData?.count}
                  isEditMode={isEditMode}
                  onDelete={() =>
                    hashtagData && handleDeleteHashtag(hashtagData.id)
                  }
                />
              );
            })}
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
                  alignItems="flex-start"
                  gap={0.8}
                  padding={0.8}
                  css={DropdownContentStyle(isDropdownOpen)}
                >
                  {hiddenHashtags.map((hashtag) => {
                    const hashtagData = hashtagsWithCount.find(
                      (h) => h.name === hashtag,
                    );
                    return (
                      <Hashtag
                        key={hashtag}
                        tag={hashtag}
                        isSelected={selectedHashtags.includes(hashtag)}
                        onClick={() => handleHashtagClick(hashtag)}
                        count={hashtagData?.count}
                        isEditMode={isEditMode}
                        onDelete={() =>
                          hashtagData && handleDeleteHashtag(hashtagData.id)
                        }
                      />
                    );
                  })}
                </Flex>
              </div>
            )}
          </Flex>
        </Flex>
        <Button
          variant={isEditMode ? 'primary' : 'secondary'}
          width="auto"
          radius="lg"
          padding={isEditMode ? '1rem 2.2rem' : '1rem'}
          onClick={toggleEditMode}
          css={ButtonStyle(isEditMode)}
        >
          {!isEditMode && <Icon name="control" size={14} />}
          <Text variant="caption" color={isEditMode ? 'white' : undefined}>
            {isEditMode ? '완료' : '편집'}
          </Text>
        </Button>
      </Flex>
    </div>
  );
};

export default HashtagFilter;
