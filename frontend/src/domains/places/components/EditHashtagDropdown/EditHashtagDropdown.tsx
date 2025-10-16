import { useId } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import useArrayChange from '@/@common/hooks/useArrayChange';
import Hashtag from '@/domains/places/components/Hashtag/Hashtag';
import { useHashtag } from '@/domains/places/hooks/useHashtag';
import type { EditHashtagDropdownProps } from '@/domains/places/types/hashtag.types';
import theme from '@/styles/theme';

import {
  EditDropdownContainerStyle,
  HashtagAddButtonStyle,
  SelectedTagsWrapperStyle,
} from './EditHashtagDropdown.styles';

const EditHashtagDropdown = ({
  initialHashtags,
  onCancel,
  onUpdate,
}: EditHashtagDropdownProps) => {
  const { showToast } = useToastContext();
  const inputId = useId();

  const {
    inputValue,
    selectedTags,
    previousTags,
    handleInputChange,
    handleAddTag,
    handleToggleTag,
    handleEnterTag,
  } = useHashtag(initialHashtags);

  const { isChanged: isHashtagsChanged } = useArrayChange(
    initialHashtags,
    selectedTags,
  );

  const handleSubmit = async () => {
    try {
      await onUpdate(selectedTags);
    } catch (error) {
      showToast({
        message: '해시태그 수정에 실패했습니다. 다시 시도해주세요.',
        type: 'error',
      });
    }
  };

  return (
    <Flex
      direction="column"
      gap={2}
      padding={1.6}
      css={EditDropdownContainerStyle}
    >
      <Flex direction="column" gap={2} alignItems="flex-start">
        <Text variant="body">해시태그 수정</Text>
        <Flex gap={1}>
          <Input
            id={inputId}
            value={inputValue}
            placeholder="해시태그를 추가하거나 만들어보세요"
            onChange={handleInputChange}
            onKeyDown={handleEnterTag}
            css={HashtagAddButtonStyle}
          />
          <Button
            variant="primary"
            onClick={() => handleAddTag(inputValue)}
            disabled={!inputValue.trim()}
            width="15%"
            radius="md"
            padding="0.6rem 0.8rem"
          >
            <Text color={theme.colors.white} variant="caption">
              추가
            </Text>
          </Button>
        </Flex>

        {selectedTags.some((tag) => !previousTags.includes(tag)) && (
          <Flex
            gap={0.6}
            justifyContent="flex-start"
            css={SelectedTagsWrapperStyle}
          >
            {selectedTags
              .filter((tag) => !previousTags.includes(tag))
              .map((tag) => (
                <Hashtag
                  key={tag}
                  tag={tag}
                  isSelected={true}
                  onClick={() => handleToggleTag(tag)}
                />
              ))}
          </Flex>
        )}
        {previousTags.length > 0 && (
          <Flex direction="column" gap={0.8} alignItems="flex-start">
            <Text variant="caption" color={theme.colors.gray[300]}>
              이전 태그 기록
            </Text>
            <Flex
              gap={0.6}
              justifyContent="flex-start"
              css={SelectedTagsWrapperStyle}
            >
              {previousTags.map((tag) => (
                <Hashtag
                  key={tag}
                  tag={tag}
                  isSelected={selectedTags.includes(tag)}
                  onClick={() => handleToggleTag(tag)}
                />
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>
      <Flex gap={1}>
        <Button variant="secondary" onClick={onCancel} radius="lg">
          <Text variant="caption">닫기</Text>
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          radius="lg"
          disabled={!isHashtagsChanged}
        >
          <Text color={theme.colors.white} variant="caption">
            수정하기
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default EditHashtagDropdown;
