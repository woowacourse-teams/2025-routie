import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useSuspenseUserQuery } from '@/domains/auth/queries/useAuthQuery';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';

import { DividerStyle, UserMenuStyle } from './UserMenu.styles';

import type { UserMenuProps } from './UserMenu.types';

const UserMenu = ({ onClick }: UserMenuProps) => {
  const { data: user } = useSuspenseUserQuery();
  const { handleMoveToManageRoutieSpace } = useRoutieSpaceNavigation();

  const role = localStorage.getItem('role');

  return (
    <div id="userMenu" css={UserMenuStyle}>
      <Flex direction="column" width="10" gap={1}>
        <Text variant="body">{user.nickname}</Text>
        <div css={DividerStyle} />
        {role === 'USER' && (
          <Button onClick={handleMoveToManageRoutieSpace}>
            <Text variant="caption" color="inherit">
              내 동선 목록
            </Text>
          </Button>
        )}
        <Button onClick={onClick}>
          <Flex gap={1}>
            <Icon name="logout" size={16} />
            <Text variant="caption" color="inherit">
              로그아웃
            </Text>
          </Flex>
        </Button>
      </Flex>
    </div>
  );
};

export default UserMenu;
