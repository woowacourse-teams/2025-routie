import Flex from '@/@common/components/Flex/Flex';
import Skeleton from '@/@common/components/Skeleton/Skeleton';

const RoutiePlaceSkeleton = () => (
  <Flex gap={0.8} alignItems="center" padding="0.8rem 0">
    <Skeleton width="2.4rem" height="2.4rem" borderRadius="50%" />
    <Flex direction="column" gap={0.4} width="100%">
      <Skeleton width="50%" height="1.6rem" />
      <Skeleton width="70%" height="1.4rem" />
    </Flex>
  </Flex>
);

const SKELETON_COUNT = 3;

const RouteViewSkeleton = () => (
  <Flex
    direction="column"
    padding="1rem"
    gap={1}
    role="status"
    aria-label="동선 목록 로딩 중"
  >
    <Skeleton width="70%" height="1.6rem" />
    {Array.from({ length: SKELETON_COUNT }, (_, i) => (
      <RoutiePlaceSkeleton key={i} />
    ))}
  </Flex>
);

export default RouteViewSkeleton;
