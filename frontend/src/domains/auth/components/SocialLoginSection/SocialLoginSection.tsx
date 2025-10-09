import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import kakaoImage from '@/assets/images/kakao.png';
import { useKakaoLoginUriQuery } from '@/domains/auth/queries/useAuthQuery';

import { DividerStyle, KakaoButtonStyle } from './SocialLoginSection.styles';

import type { SocialLoginSectionProps } from './SocialLoginSection.types';

const SocialLoginSection = ({ onClose }: SocialLoginSectionProps) => {
  const { data: kakaoLoginUri } = useKakaoLoginUriQuery();

  const saveRedirectPath = () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('redirectAfterLogin', currentPath);
  };

  const redirectToKakaoLogin = () => {
    if (kakaoLoginUri?.uri) {
      saveRedirectPath();
      onClose();
      window.open(kakaoLoginUri.uri, '_self');
    }
  };

  const handleKakaoLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    redirectToKakaoLogin();
  };
  return (
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
  );
};

export default SocialLoginSection;
