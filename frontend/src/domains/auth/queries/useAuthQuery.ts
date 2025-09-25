import { useNavigate } from 'react-router';

import { useMutation, useQuery } from '@tanstack/react-query';

import { getKakaoAccessToken, getKakaoLoginUrI } from '../apis/login';

import { loginKey } from './key';

const useKakaoLoginUriQuery = () => {
  return useQuery({
    queryKey: loginKey.kakaoLoginUri,
    queryFn: () => getKakaoLoginUrI(),
  });
};

const useKakaoLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: loginKey.kakaoAccessToken,
    mutationFn: (code: string) => getKakaoAccessToken(code),
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/', { replace: true });
    },
    onError: () => {
      console.error('카카오 로그인 실패');
    },
  });
};

export { useKakaoLoginMutation, useKakaoLoginUriQuery };
