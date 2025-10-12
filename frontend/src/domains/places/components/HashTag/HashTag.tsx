import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import SearchAddress from '@/domains/places/components/SearchAddress/SearchAddress';
import useHashTag from '@/domains/places/hooks/useHashTag';
import type { HashTagInputProps } from '@/domains/places/types/searchPlace.types';
import theme from '@/styles/theme';

import {
  PlaceInfoStyle,
  SelectedTagsWrapperStyle,
  SelectedTagStyle,
} from './HashTag.styles';

const HashTag = ({
  searchResult,
  addressType,
  address,
  onCancel,
  onSubmit,
}: HashTagInputProps) => {
  const {
    inputValue,
    selectedTags,
    previousTags,
    handleInputChange,
    handleAddTag,
    handleToggleTag,
    handleEnterTag,
  } = useHashTag();

  const handleSubmit = async () => {
    await onSubmit({
      ...searchResult,
      hashTags: selectedTags,
    });
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
      <Flex direction="column" gap={1} alignItems="flex-start">
        <Text variant="subTitle">해시태그</Text>
        <Flex gap={1}>
          <Flex width="80%">
            <Input
              id="hashtag-input"
              value={inputValue}
              placeholder="해시태그를 추가하거나 만들어보세요"
              onChange={handleInputChange}
              onKeyDown={handleEnterTag}
              maxLength={7}
            />
          </Flex>
          <Button
            variant="primary"
            onClick={() => handleAddTag(inputValue)}
            disabled={!inputValue.trim()}
            width="20%"
          >
            <Text color={theme.colors.white} variant="label">
              추가
            </Text>
          </Button>
        </Flex>
        {(selectedTags.length > 0 || previousTags.length > 0) && (
          <Flex
            gap={0.6}
            justifyContent="flex-start"
            css={SelectedTagsWrapperStyle}
          >
            {selectedTags.map((tag) => (
              <Button
                key={tag}
                variant="primary"
                onClick={() => handleToggleTag(tag)}
                padding="0.6rem 1.2rem"
                width="auto"
                css={SelectedTagStyle}
              >
                <Text variant="caption" color={theme.colors.white}>
                  {tag}
                </Text>
              </Button>
            ))}
            {previousTags
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <Button
                  key={tag}
                  variant="secondary"
                  onClick={() => handleToggleTag(tag)}
                  padding="0.6rem 1.2rem"
                  width="auto"
                >
                  <Text variant="caption">{tag}</Text>
                </Button>
              ))}
          </Flex>
        )}
      </Flex>
      <Flex gap={1}>
        <Button variant="secondary" onClick={onCancel}>
          <Text variant="body">닫기</Text>
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <Text color={theme.colors.white} variant="body">
            장소 추가하기
          </Text>
        </Button>
      </Flex>
    </>
  );
};

export default HashTag;
