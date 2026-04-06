import Flex from '@/@common/components/Flex/Flex';
import Skeleton from '@/@common/components/Skeleton/Skeleton';

import { BannerContainerStyle } from './ManageRoutieSpaceBanner.styles';

const ManageRoutieSpaceBannerSkeleton = () => (
  <div css={BannerContainerStyle} role="status" aria-label="배너 로딩 중">
    <Flex
      height="100%"
      width="70%"
      maxWidth="1580px"
      margin="0 auto"
      padding="0 0 3rem"
      justifyContent="flex-start"
      alignItems="flex-end"
    >
      <Skeleton width="12rem" height="2.4rem" />
    </Flex>
  </div>
);

export default ManageRoutieSpaceBannerSkeleton;
