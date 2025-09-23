import Button from '@/@common/components/Button/Button';
import Card from '@/@common/components/Card/Card';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';

import { DividerStyle } from './UserInfoCard.styles';

interface UserInfoCardProps {
  onClick: () => void;
  userName: string;
}

const UserInfoCard = ({ onClick, userName }: UserInfoCardProps) => {
  return (
    <Card id="userInfo" variant="default" width="20rem" height="10rem">
      <Flex direction="column" width="10" gap={1}>
        <Text variant="body">{userName}</Text>
        <div css={DividerStyle} />
        <Button onClick={onClick}>
          <Flex gap={1}>
            <Icon name="logout" size={20} />
            <Text variant="body">로그아웃</Text>
          </Flex>
        </Button>
      </Flex>
    </Card>
  );
};

export default UserInfoCard;
