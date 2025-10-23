import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import { useModal } from '@/@common/contexts/ModalContext';
import { sessionStorageUtils } from '@/@common/utils/sessionStorage';
import theme from '@/styles/theme';

import { ErrorPageContainerStyle } from './RoutieSpaceNotFound.styles';

const RoutieSpaceNotFound = () => {
  const navigate = useNavigate();
  const { closeModal } = useModal();

  useEffect(() => {
    sessionStorageUtils.remove('routieSpaceUuid');
    closeModal();
  }, []);

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Flex direction="column" gap={25} css={ErrorPageContainerStyle}>
      <Flex direction="column" gap={12}>
        <Text variant="title" color={theme.colors.gray[300]}>
          ⚠️ 루티 스페이스를 찾을 수 없습니다 ⚠️
        </Text>
        <Text variant="body" color={theme.colors.gray[300]}>
          삭제되었거나 존재하지 않는 루티 스페이스입니다.
        </Text>
      </Flex>
      <Button
        variant="primary"
        onClick={handleGoHome}
        width="20rem"
        padding="1.4rem 2rem"
        radius="lg"
      >
        <Text variant="body" color={theme.colors.white}>
          홈으로 돌아가기
        </Text>
      </Button>
    </Flex>
  );
};

export default RoutieSpaceNotFound;
