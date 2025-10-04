import { useState } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Input from '@/@common/components/Input/Input';
import Text from '@/@common/components/Text/Text';

interface GuestLoginSectionProps {
  onClose: () => void;
}

const GuestLoginSection = ({ onClose }: GuestLoginSectionProps) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Flex direction="column" alignItems="flex-start" gap={3}>
      <Flex direction="column" alignItems="flex-start" gap={1}>
        <Input
          id="nickname"
          type="text"
          label="닉네임"
          placeholder="사용할 닉네임을 입력해주세요."
          value={nickname}
          onChange={setNickname}
        />

        <Input
          id="nickname"
          type="text"
          label="비밀번호 (선택)"
          placeholder="사용할 비밀번호를 입력해주세요."
          value={password}
          onChange={setPassword}
        />
      </Flex>
      <Flex direction="column" gap={1}>
        <Text variant="description">
          닉네임과 비밀번호는 다음 입장 시 사용해야 하니 꼭 기억해주세요!
        </Text>
        <Button onClick={onClose}>
          <Text variant="caption">비회원으로 계속하기</Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default GuestLoginSection;
