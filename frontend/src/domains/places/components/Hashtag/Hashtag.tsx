import Button from '@/@common/components/Button/Button';
import Text from '@/@common/components/Text/Text';
import { HashtagProps } from '@/domains/places/types/hashtag.types';
import theme from '@/styles/theme';

import { HashtagStyle } from './Hashtag.styles';

const Hashtag = ({ tag, isSelected, onClick }: HashtagProps) => {
  return (
    <Button
      variant={isSelected ? 'primary' : 'secondary'}
      onClick={onClick}
      padding="0.6rem 1.2rem"
      width="auto"
      radius="lg"
      css={isSelected ? HashtagStyle : undefined}
    >
      <Text
        variant="caption"
        color={isSelected ? theme.colors.white : theme.colors.blue[450]}
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
    </Button>
  );
};

export default Hashtag;
