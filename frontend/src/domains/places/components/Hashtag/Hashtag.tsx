import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import type { HashtagProps } from '@/domains/places/types/hashtag.types';
import theme from '@/styles/theme';

import { ContainerStyle, ButtonStyle, DeleteStyle } from './Hashtag.styles';

const Hashtag = ({
  tag,
  isSelected,
  onClick,
  count,
  isEditMode,
  onDelete,
}: HashtagProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleClick = () => {
    if (isEditMode) return;

    onClick();
  };
  return (
    <div css={ContainerStyle}>
      <Button
        variant={isSelected ? 'primary' : 'secondary'}
        onClick={handleClick}
        padding="1rem"
        width="auto"
        radius="lg"
        css={ButtonStyle}
      >
        <Flex gap={0.4}>
          <Text
            variant="caption"
            color={isSelected ? theme.colors.white : theme.colors.gray[300]}
            aria-hidden
          >
            {tag}
          </Text>
          <span className="hide">
            이전 태그 기록 {tag},
            {isSelected
              ? 'enter를 누르면 태그가 해제됩니다.'
              : 'enter를 누르면 태그가 선택됩니다.'}
          </span>
          {count !== undefined && (
            <Text
              variant="caption"
              color={isSelected ? theme.colors.white : theme.colors.gray[300]}
            >
              ({count})
            </Text>
          )}
        </Flex>
      </Button>
      {isEditMode && (
        <Flex onClick={handleDelete} css={DeleteStyle}>
          <Icon name="deleteIcon" size={24} />
        </Flex>
      )}
    </div>
  );
};

export default Hashtag;
