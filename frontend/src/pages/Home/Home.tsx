import { useEffect } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import { useModal } from '@/@common/contexts/ModalContext';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import GoToLoginButton from '@/domains/auth/components/GoToLoginButton/GoToLoginButton';
import { useUserQuery } from '@/domains/auth/queries/useAuthQuery';
import theme from '@/styles/theme';

import {
  HomeScrollContainerStyle,
  HomeContentStyle,
  MainContentWrapperStyle,
  CircleStyle,
  RectangleStyle,
  FeedbackTextStyle,
  FeedbackButtonStyle,
  linkStyle,
} from './Home.styles';
import PhoneFrame from './PhoneChatFrame/PhoneChatFrame';

const Home = () => {
  const { openModal } = useModal();
  const { showToast } = useToastContext();
  const { data: user, error, isFetching } = useUserQuery();

  const hasAccessToken = Boolean(getAccessToken());
  const isAuthenticatedUser = user?.role === 'USER';
  const shouldShowUserUI = isAuthenticatedUser || (hasAccessToken && isFetching);

  const handleLoginClick = () => {
    openModal('socialLogin');
  };

  const FEEDBACK_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSfixG5-LD4kYYC3T0XueS7Ud7XHXbA53gJGxb60x4qwLl_4qA/viewform';

  return (
    <>
      <Header>
        {kakaoAccessToken ? (
          <UserMenuButton />
        ) : (
          <Button
            variant="primary"
            width="fit-content"
            onClick={handleLoginClick}
          >
            <Text color={theme.colors.white} variant="body">
              로그인
            </Text>
          </Button>
        )}
      </Header>
      <div css={HomeScrollContainerStyle}>
        <div css={CircleStyle} />
        <div css={RectangleStyle} />
        <Flex direction="column" padding={10} gap={10} css={HomeContentStyle}>
          <Flex direction="column" gap={20} css={MainContentWrapperStyle}>
            <Flex alignItems="flex-start" gap={4} width="auto">
              <Flex direction="column" alignItems="flex-start" gap={16}>
                <Flex direction="column" alignItems="flex-start" gap={6}>
                  <Text variant="logo" color={theme.colors.gray[300]}>
                    더 이상 카톡은 그만!
                  </Text>
                  <Flex justifyContent="flex-start">
                    <Text variant="logo" color={theme.colors.blue[450]}>
                      루티
                    </Text>
                    <Text variant="logo" color={theme.colors.gray[300]}>
                      로 모여!
                    </Text>
                  </Flex>
                </Flex>
                <Flex direction="column" alignItems="flex-start" gap={3}>
                  <Text variant="subTitle" color={theme.colors.gray[300]}>
                    친구들과 당일치기 여행 계획 중
                  </Text>
                  <Flex direction="column" alignItems="flex-start" gap={1}>
                    <Text variant="subTitle" color={theme.colors.gray[300]}>
                      대화가 계속 올라가 불편했다면?
                    </Text>
                    <Text variant="subTitle" color={theme.colors.gray[300]}>
                      흐름 파악이 힘들었다면?
                    </Text>
                  </Flex>
                  <Flex justifyContent="flex-start" css={{ marginTop: '5rem' }}>
                    <Text variant="subTitle" color={theme.colors.blue[450]}>
                      루티
                    </Text>
                    <Text variant="subTitle" color={theme.colors.gray[300]}>
                      에서 함께 동선을 만들어보세요!
                    </Text>
                  </Flex>
                </Flex>
                <GoToLoginButton onClick={handleLoginClick} />
              </Flex>
              <PhoneFrame />
            </Flex>
          </Flex>
          <Flex height="25vh" direction="column" css={FeedbackTextStyle}>
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={2}>
                <Text variant="title">루티가 불편하다면?</Text>
                <Text variant="subTitle">개발자에게 피드백을 주세요!</Text>
              </Flex>
              <a
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                css={[linkStyle, FeedbackButtonStyle]}
              >
                <Text variant="subTitle" color={theme.colors.white}>
                  피드백 작성하러 가기
                </Text>
              </a>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default Home;
