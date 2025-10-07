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
  SubTitleTextStyle,
  TitleTextStyle,
  VioletTextStyle,
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
        padding={5}
        css={HomepageStyle}
      >
        <Flex direction="column" gap={3}>
          <Text variant="title" css={TitleTextStyle} color={theme.home.text}>
            그 장소들, 정말 다 갈 수 있을까요?
          </Text>
          <Text variant="body" color={theme.home.text} css={SubTitleTextStyle}>
            루티가 당신의 동선을 <span css={VioletTextStyle}>체크</span>
            해드릴게요!
          </Text>
          <Flex gap={8} width="80%" css={ButtonWrapperStyle}>
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
