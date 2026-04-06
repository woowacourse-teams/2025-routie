import Flex from '@/@common/components/Flex/Flex';
import Skeleton from '@/@common/components/Skeleton/Skeleton';

const PlaceCardSkeleton = () => (
  <Flex direction="column" gap={0.8} padding="1.6rem">
    <Skeleton width="60%" height="1.6rem" />
    <Skeleton width="80%" height="1.4rem" />
    <Flex gap={0.4}>
      <Skeleton width="5rem" height="1.2rem" borderRadius="8px" />
      <Skeleton width="4rem" height="1.2rem" borderRadius="8px" />
    </Flex>
  </Flex>
);

const SKELETON_COUNT = 4;

const PlaceViewSkeleton = () => (
  <Flex direction="column" role="status" aria-label="장소 목록 로딩 중">
    <Skeleton height="4rem" />
    {Array.from({ length: SKELETON_COUNT }, (_, i) => (
      <PlaceCardSkeleton key={i} />
    ))}
  </Flex>
);

export default PlaceViewSkeleton;
