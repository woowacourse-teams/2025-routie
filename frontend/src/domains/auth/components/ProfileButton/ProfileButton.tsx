import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import Profile from '@/domains/auth/components/Profile/Profile';

import { ProfileButtonStyle } from './ProfileButton.styles';

import type { ProfileButtonProps } from './ProfileButton.types';

const ProfileButton = ({ onClick, text }: ProfileButtonProps) => {
  return (
    <Button css={ProfileButtonStyle} onClick={onClick}>
      <Flex gap={1} width="1">
        <Profile />
        <Text variant="body">{text}</Text>
      </Flex>
    </Button>
  );
};

export default ProfileButton;
