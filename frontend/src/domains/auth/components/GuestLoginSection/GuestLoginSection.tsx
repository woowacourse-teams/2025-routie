import { useState } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { useGuestLoginMutation } from '@/domains/auth/queries/useAuthQuery';
import theme from '@/styles/theme';

import type { GuestLoginSectionProps } from './GuestLoginSection.types';

const GuestLoginSection = ({ onClose }: GuestLoginSectionProps) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { showToast } = useToastContext();
  const { mutate: guestLogin, isPending } = useGuestLoginMutation();

  const handleNicknameChange = (value: string) => {
    if (errorMessage) setErrorMessage('');
    setNickname(value);
  };

  const handleGuestLogin = () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    const routieSpaceIdentifier = localStorage.getItem('routieSpaceUuid');

    if (!routieSpaceIdentifier) {
      showToast({
        message: '잘못된 주소입니다. 링크를 다시 확인해주세요.',
        type: 'error',
      });
      return;
    }

    guestLogin(
      {
        nickname: trimmedNickname,
        password: password ? password : undefined,
        routieSpaceIdentifier,
      },
      {
        onSuccess: () => {
          setErrorMessage('');
          onClose();
        },
        onError: () => {
          setErrorMessage('닉네임 또는 비밀번호가 틀렸습니다.');
        },
      },
    );
  };

  return (
    <Flex direction="column" alignItems="flex-start" gap={3}>
      <Flex direction="column" alignItems="flex-start" gap={1}>
        <Input
          id="nickname"
          type="text"
          label="닉네임"
          placeholder="사용할 닉네임을 입력해주세요."
          value={nickname}
          onChange={handleNicknameChange}
        />

        <Input
          id="password"
          type="text"
          label="비밀번호 (선택)"
          placeholder="사용할 비밀번호를 입력해주세요."
          value={password}
          onChange={setPassword}
        />
        {errorMessage && (
          <Text variant="label" color={theme.colors.red[100]}>
            {errorMessage}
          </Text>
        )}
      </Flex>
      <Flex direction="column" gap={1}>
        <Text variant="label" color={theme.colors.gray[300]}>
          닉네임과 비밀번호는 다음 입장 시 사용해야 하니 꼭 기억해주세요!
        </Text>
        <Button
          variant="primary"
          type="button"
          onClick={handleGuestLogin}
          disabled={isPending}
        >
          <Text color="inherit" variant="caption">
            비회원으로 계속하기
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default GuestLoginSection;
