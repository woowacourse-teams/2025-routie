import { useNavigate } from 'react-router';

import { useMutation, useQuery } from '@tanstack/react-query';

import { getUserName } from '@/domains/auth/apis/user';

import { getKakaoAccessToken, getKakaoLoginUri } from '../apis/login';

import { loginKey, userKey } from './key';

const useKakaoLoginUriQuery = () => {
  return useQuery({
    queryKey: loginKey.kakaoLoginUri,
    queryFn: () => getKakaoLoginUri(),
  });
};

const useKakaoLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: loginKey.kakaoAccessToken,
    mutationFn: (code: string) => getKakaoAccessToken(code),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/', { replace: true });
    },
    onError: () => {
      console.error('카카오 로그인 실패');
    },
  });
};

const useUserNickNameQuery = () => {
  return useQuery({
    queryKey: userKey.userName,
    queryFn: () => getUserName(),
  });
};

export { useKakaoLoginMutation, useKakaoLoginUriQuery, useUserNickNameQuery };
