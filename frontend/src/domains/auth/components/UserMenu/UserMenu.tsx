import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useUserNickNameQuery } from '@/domains/auth/queries/useAuthQuery';

import { DividerStyle, UserMenuStyle } from './UserMenu.styles';

import type { UserMenuProps } from './UserMenu.types';

const UserMenu = ({ onClick }: UserMenuProps) => {
  const { data: userName } = useUserNickNameQuery();
  return (
    <div id="userMenu" css={UserMenuStyle}>
      <Flex direction="column" width="10" gap={1}>
        <Text variant="body">{userName}</Text>
        <div css={DividerStyle} />
        <Button onClick={onClick}>
          <Flex gap={1}>
            <Icon name="logout" size={20} />
            <Text variant="caption">로그아웃</Text>
          </Flex>
        </Button>
      </Flex>
    </div>
  );
};

export default UserMenu;
