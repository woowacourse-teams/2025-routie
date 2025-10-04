import { useNavigate } from 'react-router';

import { useMutation, useQuery } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';

import {
  getKakaoAccessToken,
  getKakaoLoginUri,
  postGuestLogin,
} from '../apis/login';
import { getUser } from '../apis/user';

import { loginKey, userKey } from './key';

import type { GuestLoginRequestType } from '../types/api.types';

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

const useUserQuery = () => {
  return useQuery({
    queryKey: userKey.all,
    queryFn: () => getUser(),
  });
};

const useGuestLoginMutation = () => {
  const { showToast } = useToastContext();
  return useMutation({
    mutationKey: loginKey.guestAccessToken,
    mutationFn: (payload: GuestLoginRequestType) => postGuestLogin(payload),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      showToast({
        message: '비회원 로그인에 성공했습니다.',
        type: 'success',
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        type: 'error',
      });
    },
  });
};

export {
  useGuestLoginMutation,
  useKakaoLoginMutation,
  useKakaoLoginUriQuery,
  useUserQuery,
};
