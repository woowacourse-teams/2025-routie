import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import { useModal } from '@/@common/contexts/ModalContext';
import GoToLoginButton from '@/domains/auth/components/GoToLoginButton/GoToLoginButton';
import UserMenuButton from '@/domains/auth/components/UserMenuButton/UserMenuButton';
import theme from '@/styles/theme';

import {
  HomeScrollContainerStyle,
  HomeContentStyle,
  MainContentWrapperStyle,
  CircleStyle,
  RectangleStyle,
  BlueTextStyle,
  ButtonWrapperStyle,
  CreateButtonStyle,
  ContinueButtonStyle,
  FeedbackButtonStyle,
  linkStyle,
} from './Home.styles';
import PhoneFrame from './PhoneChatFrame/PhoneChatFrame';
import { useRoutieSpaceNavigation } from './hooks/useRoutieSpaceNavigation';

const Home = () => {
  const { handleCreateRoutieSpace, handleMoveToManageRoutieSpace } =
    useRoutieSpaceNavigation();
  const { openModal } = useModal();
  const kakaoAccessToken = localStorage.getItem('accessToken');

  const handleLoginClick = () => {
    openModal('login');
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
          <Flex
            direction="column"
            alignItems="center"
            gap={20}
            css={MainContentWrapperStyle}
          >
            <Flex
              direction="column"
              alignItems="flex-start"
              justifyContent="center"
              gap={4}
              width="auto"
            >
              <Flex direction="column" gap={16}>
                <Flex direction="column" alignItems="flex-start" gap={6}>
                  <Text variant="logo" color={theme.colors.gray[300]}>
                    더 이상 카톡은 그만!
                  </Text>
                  <Text variant="logo" color={theme.colors.gray[300]}>
                    <span css={BlueTextStyle}>루티</span>로 모여!
                  </Text>
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
                  <Text
                    variant="subTitle"
                    color={theme.colors.gray[300]}
                    css={{ marginTop: '5rem' }}
                  >
                    <span css={BlueTextStyle}>루티</span>에서 함께 동선을
                    만들어보세요!
                  </Text>
                </Flex>
              </Flex>

              <Flex css={ButtonWrapperStyle}>
                {kakaoAccessToken ? (
                  <>
                    <Button
                      onClick={handleCreateRoutieSpace}
                      css={CreateButtonStyle}
                    >
                      <Flex gap={1.5} padding={1}>
                        <Icon name="arrowWhite" size={30} />
                        <Text variant="title" color="white">
                          동선 만들러가기
                        </Text>
                      </Flex>
                    </Button>
                    <Button
                      onClick={handleMoveToManageRoutieSpace}
                      css={ContinueButtonStyle}
                    >
                      <Flex gap={1.5} padding={1}>
                        <Icon name="list" size={34} />
                        <Text variant="title" color={theme.home.violet}>
                          내 동선 목록 보러가기
                        </Text>
                      </Flex>
                    </Button>
                  </>
                ) : (
                  <GoToLoginButton onClick={handleLoginClick} />
                )}
              </Flex>
            </Flex>
            <Flex direction="column" width="auto">
              <PhoneFrame />
            </Flex>
          </Flex>
          <Flex
            height="25vh"
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Flex direction="column" gap={3}>
              <Flex direction="column" gap={2}>
                <Text variant="title">루티가 불편하다면?</Text>
                <Text variant="subTitle">개발자에게 피드백을 주세요!</Text>
              </Flex>
              <a
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                css={linkStyle}
              >
                <Button variant="primary" css={FeedbackButtonStyle}>
                  <Text variant="subTitle" color="white">
                    피드백 작성하러 가기
                  </Text>
                </Button>
              </a>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default Home;
