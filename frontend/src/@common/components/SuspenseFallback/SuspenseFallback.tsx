import Flex from '@/@common/components/Flex/Flex';
import Spinner from '@/@common/components/Spinner/Spinner';

const SuspenseFallback = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100%"
      role="status"
      aria-label="로딩 중"
    >
      <Spinner />
    </Flex>
  );
};

export default SuspenseFallback;
