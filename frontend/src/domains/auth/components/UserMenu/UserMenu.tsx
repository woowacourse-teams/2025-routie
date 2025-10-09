import { useEffect } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useUserQuery } from '@/domains/auth/queries/useAuthQuery';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';

import { DividerStyle, UserMenuStyle } from './UserMenu.styles';

import type { UserMenuProps } from './UserMenu.types';

const UserMenu = ({ onClick }: UserMenuProps) => {
  const { data: user, error, isLoading } = useUserQuery();
  const { handleMoveToManageRoutieSpace } = useRoutieSpaceNavigation();

  const role = localStorage.getItem('role');

  const renderUserName = () => {
    if (isLoading) {
      return <Text variant="body">로딩중...</Text>;
    }

    if (error) {
      return <Text variant="body">닉네임 불러오기 오류</Text>;
    }

    return <Text variant="body">{user?.nickName}</Text>;
  };

  return (
    <div id="userMenu" css={UserMenuStyle}>
      <Flex direction="column" width="10" gap={1}>
        {renderUserName()}
        <div css={DividerStyle} />
        {role === 'USER' && (
          <Button onClick={handleMoveToManageRoutieSpace}>
            <Text variant="caption">내 동선 목록</Text>
          </Button>
        )}
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
