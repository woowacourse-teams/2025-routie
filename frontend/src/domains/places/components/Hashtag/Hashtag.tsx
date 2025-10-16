import Button from '@/@common/components/Button/Button';
import Text from '@/@common/components/Text/Text';
import { formatHashtag } from '@/@common/utils/format';
import { HashtagProps } from '@/domains/places/types/hashtag.types';
import theme from '@/styles/theme';

import { HashtagStyle } from './Hashtag.styles';

const Hashtag = ({ tag, isSelected, onClick }: HashtagProps) => {
  const displayTag = formatHashtag(tag);

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
      >
        {displayTag}
      </Text>
    </Button>
  );
};

export default Hashtag;
