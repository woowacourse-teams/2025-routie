import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import RoutieSpaceListItem from '@/pages/ManageRoutieSpaces/components/RoutieSpaceListItem/RoutieSpaceListItem';
import type { RoutieSpaceListItemProps } from '@/pages/ManageRoutieSpaces/components/RoutieSpaceListItem/RoutieSpaceListItem.types';

import { RoutieSpaceListStyle } from './RotieSpaceList.styles';

interface RoutieSpaceListProps {
  routieSpaces: RoutieSpaceListItemProps[];
}

const RoutieSpaceList = ({ routieSpaces }: RoutieSpaceListProps) => {
  return routieSpaces.length > 0 ? (
    <ul css={RoutieSpaceListStyle}>
      {routieSpaces.map((routieSpace) => (
        <RoutieSpaceListItem
          key={routieSpace.routieSpaceUuid}
          {...routieSpace}
        />
      ))}
    </ul>
  ) : (
    <Flex height="50dvh">
      <Text variant="body">아직 생성한 동선이 없습니다...😅</Text>
    </Flex>
  );
};

export default RoutieSpaceList;
