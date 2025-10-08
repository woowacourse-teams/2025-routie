import Flex from '@/@common/components/Flex/Flex';
import type { ModalProps } from '@/@common/components/Modal/Modal.types';
import ModalLayout from '@/@common/components/ModalLayout/ModalLayout';
import Text from '@/@common/components/Text/Text';
import SocialLoginSection from '@/domains/auth/components/SocialLoginSection/SocialLoginSection';

import { LoginModalStyle } from './LoginModal.styles';

const SocialLoginModal = ({ onClose }: Pick<ModalProps, 'onClose'>) => {
  return (
    <ModalLayout onClose={onClose} showCloseButton={true} width="36rem">
      <div css={LoginModalStyle}>
        <Flex direction="column" gap={3}>
          <Flex direction="column" gap={1}>
            <Text variant="subTitle">루티와 함께</Text>
            <Text variant="subTitle">동선을 손쉽게 완성하세요!</Text>
          </Flex>
          <Flex direction="column" gap={3}>
            <SocialLoginSection onClose={onClose} />
          </Flex>
        </Flex>
      </div>
    </ModalLayout>
  );
};

export default SocialLoginModal;
