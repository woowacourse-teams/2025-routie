import Flex from '@/@common/components/Flex/Flex';
import Spinner from '@/@common/components/Spinner/Spinner';
import Text from '@/@common/components/Text/Text';

const KakaoAuthCallback = () => {
  return (
    <Flex direction="column" alignItems="center" height="100vh" gap={2}>
      <Spinner />
      <Text variant="title">로그인 중...</Text>
    </Flex>
  );
};

export default KakaoAuthCallback;
