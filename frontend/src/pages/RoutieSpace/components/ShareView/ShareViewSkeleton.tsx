import Flex from '@/@common/components/Flex/Flex';
import Skeleton from '@/@common/components/Skeleton/Skeleton';

const ShareViewSkeleton = () => (
  <Flex
    direction="column"
    gap={2}
    padding="1rem"
    alignItems="flex-start"
    role="status"
    aria-label="공유 뷰 로딩 중"
  >
    <Skeleton width="70%" height="1.4rem" />
    <Skeleton width="100%" height="3rem" borderRadius="8px" />
  </Flex>
);

export default ShareViewSkeleton;
