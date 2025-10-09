import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToastContext } from '@/@common/contexts/useToastContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import {
  getKakaoAccessToken,
  getKakaoLoginUri,
  postGuestLogin,
} from '@/domains/auth/apis/login';
import { getUser } from '@/domains/auth/apis/user';
import { loginKey, userKey } from '@/domains/auth/queries/key';
import type { GuestLoginRequestType } from '@/domains/auth/types/api.types';

const useKakaoLoginUriQuery = () => {
  return useQuery({
    queryKey: loginKey.kakaoLoginUri,
    queryFn: () => getKakaoLoginUri(),
  });
};

const useKakaoLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: loginKey.kakaoAccessToken,
    mutationFn: (code: string) => getKakaoAccessToken(code),
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      await queryClient.fetchQuery({
        queryKey: userKey.all,
        queryFn: () => getUser(),
      });
    },
    onError: () => {
      console.error('카카오 로그인 실패');
    },
  });
};

const useUserQuery = () => {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: userKey.all,
    queryFn: () => getUser(),
    enabled: Boolean(accessToken),
  });
};

const useGuestLoginMutation = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: loginKey.guestAccessToken,
    mutationFn: (payload: GuestLoginRequestType) => postGuestLogin(payload),
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      await queryClient.fetchQuery({
        queryKey: userKey.all,
        queryFn: () => getUser(),
      });
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
