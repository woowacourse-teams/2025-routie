import { SkeletonBoxStyle } from './Skeleton.styles';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

const Skeleton = ({
  width = '100%',
  height = '1.6rem',
  borderRadius,
}: SkeletonProps) => {
  return (
    <div
      css={[SkeletonBoxStyle, { width, height, borderRadius }]}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
