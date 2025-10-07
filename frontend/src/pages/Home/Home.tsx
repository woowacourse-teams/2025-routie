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
  ButtonWrapperStyle,
  ContinueButtonStyle,
  CreateButtonStyle,
  HomepageStyle,
  BlueTextStyle,
} from './Home.styles';
import { useRoutieSpaceNavigation } from './hooks/useRoutieSpaceNavigation';

const Home = () => {
  const { handleCreateRoutieSpace, handleMoveToManageRoutieSpace } =
    useRoutieSpaceNavigation();
  const { openModal } = useModal();
  const kakaoAccessToken = localStorage.getItem('accessToken');

  const handleLoginClick = () => {
    openModal('login');
  };

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
      <Flex
        direction="column"
        height="calc(100dvh - 7.1rem)"
        padding={40}
        css={HomepageStyle}
      >
        <Flex direction="column" alignItems="flex-start" gap={3}>
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
      </Flex>
    </>
  );
};

export default Home;
