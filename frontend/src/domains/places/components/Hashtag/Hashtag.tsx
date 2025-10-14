import Button from '@/@common/components/Button/Button';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { HashtagStyle } from './Hashtag.styles';

interface HashtagProps {
  tag: string;
  isSelected: boolean;
  onClick: () => void;
}

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
