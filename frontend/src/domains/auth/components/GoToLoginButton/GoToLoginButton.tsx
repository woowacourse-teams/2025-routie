import Button from '@/@common/components/Button/Button';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import { GoToLoginButtonStyle } from './GoToLoginButton.styles';

import type { GoToLoginButtonProps } from './GoToLoginButton.types';

const GoToLoginButton = ({ onClick }: GoToLoginButtonProps) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      css={GoToLoginButtonStyle}
      width="54rem"
      padding="2rem"
    >
      <Text color={theme.colors.white} variant="subTitle">
        친구들과 동선 만들러 가기
      </Text>
    </Button>
  );
};

export default GoToLoginButton;
