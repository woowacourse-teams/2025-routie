import RoutieSpaceListItem from '@/pages/ManageRoutieSpaces/components/RoutieSpaceListItem/RoutieSpaceListItem';
import type { RoutieSpaceListItemProps } from '@/pages/ManageRoutieSpaces/components/RoutieSpaceListItem/RoutieSpaceListItem.types';

import { RoutieSpaceListStyle } from './RotieSpaceList.styles';

interface RoutieSpaceListProps {
  routieSpaces: RoutieSpaceListItemProps[];
}

const RoutieSpaceList = ({ routieSpaces }: RoutieSpaceListProps) => {
  return (
    <ul css={RoutieSpaceListStyle}>
      {routieSpaces.map((routieSpace) => (
        <RoutieSpaceListItem
          key={routieSpace.routieSpaceUuid}
          {...routieSpace}
        />
      ))}
    </ul>
  );
};

export default RoutieSpaceList;
