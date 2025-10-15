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
        color={isSelected ? theme.colors.white : undefined}
      >
        {tag}
      </Text>
    </Button>
  );
};

export default Hashtag;
