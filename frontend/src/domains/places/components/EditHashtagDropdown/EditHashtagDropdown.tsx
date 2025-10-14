import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import Hashtag from '@/domains/places/components/Hashtag/Hashtag';
import theme from '@/styles/theme';

import useHashtag from '../../hooks/useHashtag';

import {
  EditDropdownContainerStyle,
  HashtagAddButtonStyle,
  SelectedTagsWrapperStyle,
} from './EditHashtagDropdown.styles';

interface EditHashtagDropdownProps {
  initialHashtags?: string[];
  onCancel: () => void;
  onUpdate: (hashtags: string[]) => Promise<void>;
}

const EditHashtagDropdown = ({
  initialHashtags = [],
  onCancel,
  onUpdate,
}: EditHashtagDropdownProps) => {
  const { showToast } = useToastContext();

  const {
    inputValue,
    selectedTags,
    previousTags,
    handleInputChange,
    handleAddTag,
    handleToggleTag,
    handleEnterTag,
  } = useHashtag(initialHashtags);

  const isHashtagsChanged =
    JSON.stringify(selectedTags) !== JSON.stringify(initialHashtags);

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
    <div css={EditDropdownContainerStyle}>
      <Flex direction="column" gap={2}>
        <Flex direction="column" gap={2} alignItems="flex-start">
          <Text variant="subTitle">해시태그 수정</Text>
          <Flex gap={1}>
            <Input
              id="hashtag-input"
              value={inputValue}
              placeholder="해시태그를 추가하거나 만들어보세요"
              onChange={handleInputChange}
              onKeyDown={handleEnterTag}
              maxLength={6}
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

          {selectedTags.filter((tag) => !previousTags.includes(tag)).length >
            0 && (
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
                내가 사용했던 태그
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
    </div>
  );
};

export default EditHashtagDropdown;
