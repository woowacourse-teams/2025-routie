import { useEffect } from 'react';

import { getAccessToken } from '@/@common/utils/getAccessToken';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';

const useCheckLogin = () => {
  const { handleMoveToHome } = useRoutieSpaceNavigation();

  useEffect(() => {
    const kakaoAccessToken = getAccessToken();
    if (!kakaoAccessToken) {
      alert('로그인이 필요합니다.');
      handleMoveToHome();
    }
  }, [handleMoveToHome]);
};

export { useCheckLogin };
