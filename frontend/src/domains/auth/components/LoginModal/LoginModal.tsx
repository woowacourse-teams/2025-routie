import Flex from '@/@common/components/Flex/Flex';
import type { ModalProps } from '@/@common/components/Modal/Modal.types';
import ModalLayout from '@/@common/components/ModalLayout/ModalLayout';
import Text from '@/@common/components/Text/Text';
import { useToastContext } from '@/@common/contexts/useToastContext';
import kakaoImage from '@/assets/images/kakao.png';

import { useKakaoLoginUriQuery } from '../../queries/useAuthQuery';

import {
  LoginModalStyle,
  KakaoButtonStyle,
  DividerStyle,
} from './LoginModal.styles';

const LoginModal = ({ onClose }: Pick<ModalProps, 'onClose'>) => {
  const { data: kakaoLoginUri } = useKakaoLoginUriQuery();
  const { showToast } = useToastContext();

  const redirectToKakaoLogin = async () => {
    try {
      if (kakaoLoginUri?.uri) {
        window.open(kakaoLoginUri.uri, '_self');
      }
      onClose();
    } catch (err: any) {
      showToast({
        message: err?.message,
        type: 'error',
      });
    }
  };

  const handleKakaoLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    redirectToKakaoLogin();
  };

  return (
    <ModalLayout onClose={onClose} showCloseButton={true} width="36rem">
      <div css={LoginModalStyle}>
        <Flex direction="column" gap={4}>
          <Flex direction="column" gap={1}>
            <Text variant="subTitle">루티와 함께</Text>
            <Text variant="subTitle">동선을 손쉽게 완성하세요!</Text>
          </Flex>
          <Flex direction="column" gap={3}>
            <Flex gap={1}>
              <div css={DividerStyle} />
              <Text variant="caption">SNS 계정으로 간편로그인</Text>
              <div css={DividerStyle} />
            </Flex>
            <a href="#" onClick={handleKakaoLinkClick} css={KakaoButtonStyle}>
              <img src={kakaoImage} alt="카카오 로그인" />
            </a>
          </Flex>
        </Flex>
      </div>
    </ModalLayout>
  );
};

export default LoginModal;
