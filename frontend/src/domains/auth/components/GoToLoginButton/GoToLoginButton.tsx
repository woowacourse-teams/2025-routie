import Button from '@/@common/components/Button/Button';
import Text from '@/@common/components/Text/Text';

import { GoToLoginButtonStyle } from './GoToLoginButton.styles';

import type { GoToLoginButtonProps } from './GoToLoginButton.types';

const GoToLoginButton = ({ onClick }: GoToLoginButtonProps) => {
  return (
    <Button css={GoToLoginButtonStyle} onClick={onClick} padding="2rem">
      <Text variant="title">로그인하고 동선 만들러 가기</Text>
    </Button>
  );
};

export default GoToLoginButton;
