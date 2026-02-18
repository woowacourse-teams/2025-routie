import Skeleton from '@/@common/components/Skeleton/Skeleton';

import {
  ManageRoutieSpacesSkeletonStyle,
  HeaderSkeletonStyle,
  GridSkeletonStyle,
} from './ManageRoutieSpacesSkeleton.styles';
import ManageRoutieSpaceBannerSkeleton from './components/ManageRoutieSpaceBanner/ManageRoutieSpaceBannerSkeleton';

const GRID_ITEM_COUNT = 4;

const ManageRoutieSpacesSkeleton = () => (
  <div
    css={ManageRoutieSpacesSkeletonStyle}
    role="status"
    aria-label="페이지 로딩 중"
  >
    <div css={HeaderSkeletonStyle}>
      <Skeleton width="8rem" height="3rem" />
      <Skeleton width="4rem" height="4rem" borderRadius="50%" />
    </div>
    <ManageRoutieSpaceBannerSkeleton />
    <div css={GridSkeletonStyle}>
      {Array.from({ length: GRID_ITEM_COUNT }, (_, i) => (
        <Skeleton key={i} width="100%" height="16rem" borderRadius="12px" />
      ))}
    </div>
  </div>
);

export default ManageRoutieSpacesSkeleton;
