import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import Flex from '@/@common/components/Flex/Flex';
import Spinner from '@/@common/components/Spinner/Spinner';
import Text from '@/@common/components/Text/Text';
import { useKakaoLoginMutation } from '@/domains/auth/queries/useAuthQuery';

const KakaoAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: kakaoAccessTokenMutate, isError } = useKakaoLoginMutation();

  const code = searchParams.get('code');

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const handleKakaoLogin = async () => {
      if (!code) {
        navigate('/', { replace: true });
        return;
      }
      kakaoAccessTokenMutate(code);
    };
    handleKakaoLogin();
  }, []);

  return (
    <Flex direction="column" height="100vh" gap={2}>
      {isError ? (
        <Flex direction="column" gap={2}>
          <Text variant="title">로그인 실패</Text>
          <button onClick={handleGoHome}>홈으로 가기</button>
        </Flex>
      ) : (
        <>
          <Spinner />
          <Text variant="title">로그인 중...</Text>
        </>
      )}
    </Flex>
  );
};

export default KakaoAuthCallback;
