import Flex from '@/@common/components/Flex/Flex';
import Skeleton from '@/@common/components/Skeleton/Skeleton';

import {
  RoutieSpaceSkeletonStyle,
  SidebarSkeletonStyle,
} from './RoutieSpaceSkeleton.styles';

const RoutieSpaceSkeleton = () => (
  <div css={RoutieSpaceSkeletonStyle} role="status" aria-label="페이지 로딩 중">
    <div css={SidebarSkeletonStyle}>
      <Flex direction="column" alignItems="center" padding="1.4rem 0" gap={1}>
        <Skeleton width="3.5rem" height="3.5rem" borderRadius="8px" />
        <Skeleton width="3rem" height="3rem" borderRadius="8px" />
        <Skeleton width="3rem" height="3rem" borderRadius="8px" />
        <Skeleton width="3rem" height="3rem" borderRadius="8px" />
      </Flex>
    </div>
  </div>
);

export default RoutieSpaceSkeleton;
