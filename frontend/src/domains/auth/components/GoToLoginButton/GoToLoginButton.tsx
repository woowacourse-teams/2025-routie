import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

import { GoToLoginButtonStyle } from './GoToLoginButton.styles';

interface LoginButtonProps {
  onClick: () => void;
}

const GoToLoginButton = ({ onClick }: LoginButtonProps) => {
  return (
    <Button css={GoToLoginButtonStyle} onClick={onClick}>
      <Flex gap={1.5} padding={1}>
        <Text variant="title">로그인하고 동선 만들러 가기</Text>
      </Flex>
    </Button>
  );
};
export default GoToLoginButton;
