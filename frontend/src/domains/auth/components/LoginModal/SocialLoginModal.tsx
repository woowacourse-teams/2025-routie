import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import type { ModalProps } from '@/@common/components/Modal/Modal.types';
import ModalLayout from '@/@common/components/ModalLayout/ModalLayout';
import Text from '@/@common/components/Text/Text';
import SocialLoginSection from '@/domains/auth/components/SocialLoginSection/SocialLoginSection';
import theme from '@/styles/theme';

import { LoginModalStyle } from './LoginModal.styles';

const SocialLoginModal = ({ onClose }: Pick<ModalProps, 'onClose'>) => {
  return (
    <ModalLayout onClose={onClose} showCloseButton={true} width="36rem">
      <div css={LoginModalStyle}>
        <Flex direction="column" gap={3}>
          <Icon name="mascot" size={100} height={110} />
          <Flex direction="column" gap={1}>
            <Flex>
              <Text variant="subTitle" color={theme.colors.blue[450]}>
                루티
              </Text>
              <Text variant="subTitle">와 함께</Text>
            </Flex>
            <Text variant="subTitle">동선을 손쉽게 완성하세요!</Text>
          </Flex>
          <SocialLoginSection onClose={onClose} />
        </Flex>
      </div>
    </ModalLayout>
  );
};

export default SocialLoginModal;
