import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import Hashtag from '@/domains/places/components/Hashtag/Hashtag';
import SearchAddress from '@/domains/places/components/SearchAddress/SearchAddress';
import useHashtag from '@/domains/places/hooks/useHashtag';
import type { HashtagInputProps } from '@/domains/places/types/searchPlace.types';
import theme from '@/styles/theme';

import {
  HashtagAddButtonStyle,
  PlaceInfoStyle,
  SelectedTagsWrapperStyle,
} from './AddHashtagDropdown.styles';

const AddHashtagDropdown = ({
  searchResult,
  addressType,
  address,
  onCancel,
  onSubmit,
  mode = 'add',
  initialHashtags,
  onUpdate,
}: HashtagInputProps) => {
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

  const normalize = (arr?: string[]) =>
    Array.from(new Set((arr ?? []).map((s) => s.trim()))).sort();

  const isHashtagsChanged =
    mode === 'edit' &&
    (() => {
      const a = normalize(selectedTags);
      const b = normalize(initialHashtags);
      if (a.length !== b.length) return true;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
      return false;
    })();

  const handleSubmit = async () => {
    try {
      if (mode === 'edit' && onUpdate) {
        await onUpdate(selectedTags);
      } else {
        await onSubmit({
          ...searchResult,
          hashtags: selectedTags,
        });
      }
    } catch (error) {
      showToast({
        message:
          mode === 'edit'
            ? '해시태그 수정에 실패했습니다. 다시 시도해주세요.'
            : '장소 추가에 실패했습니다. 다시 시도해주세요.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <Flex
        direction="column"
        gap={1}
        padding={2}
        alignItems="flex-start"
        css={PlaceInfoStyle}
      >
        <Text variant="body">{searchResult.name}</Text>
        <SearchAddress addressType={addressType} address={address} />
      </Flex>
      <Flex direction="column" gap={2} alignItems="flex-start">
        <Text variant="subTitle">해시태그</Text>
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
          disabled={mode === 'edit' && !isHashtagsChanged}
        >
          <Text color={theme.colors.white} variant="caption">
            {mode === 'edit' ? '수정하기' : '장소 추가하기'}
          </Text>
        </Button>
      </Flex>
    </>
  );
};

export default AddHashtagDropdown;
