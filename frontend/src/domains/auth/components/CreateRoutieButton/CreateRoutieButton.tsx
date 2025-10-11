import Button from '@/@common/components/Button/Button';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { CreateRoutieButtonStyle } from './CreateRoutieButton.styles';

import type { CreateRoutieButtonProps } from './CreateRoutieButton.types';

const CreateRoutieButton = ({ onClick }: CreateRoutieButtonProps) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      css={CreateRoutieButtonStyle}
      width="54rem"
      padding="2rem"
    >
      <Text color={theme.colors.white} variant="subTitle">
        친구들과 동선 만들러 가기
      </Text>
    </Button>
  );
};

export default CreateRoutieButton;
