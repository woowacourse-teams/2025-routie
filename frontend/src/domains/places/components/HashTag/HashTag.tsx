import Button from '@/@common/components/Button/Button';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { HashTagStyle } from './HashTag.styles';

interface HashTagProps {
  tag: string;
  isSelected: boolean;
  onClick: () => void;
}

const HashTag = ({ tag, isSelected, onClick }: HashTagProps) => {
  return (
    <Button
      variant={isSelected ? 'primary' : 'secondary'}
      onClick={onClick}
      padding="0.6rem 1.2rem"
      width="auto"
      radius="lg"
      css={isSelected ? HashTagStyle : undefined}
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

export default HashTag;
