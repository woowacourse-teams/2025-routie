import { useEffect } from 'react';

import FeedbackWidget from '@/@common/components/FeedbackWidget/FeedbackWidget';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import { useModal } from '@/@common/contexts/ModalContext';
import { useToastContext } from '@/@common/contexts/useToastContext';
import { getAccessToken } from '@/@common/utils/getAccessToken';
import CreateRoutieButton from '@/domains/auth/components/CreateRoutieButton/CreateRoutieButton';
import { useUserQuery } from '@/domains/auth/queries/useAuthQuery';
import theme from '@/styles/theme';

import {
  HomeScrollContainerStyle,
  HomeContentStyle,
  MainContentWrapperStyle,
  CircleStyle,
  RectangleStyle,
} from './Home.styles';
import PhoneFrame from './PhoneChatFrame/PhoneChatFrame';
import { useRoutieSpaceNavigation } from './hooks/useRoutieSpaceNavigation';

const Home = () => {
  const { handleMoveToHome, handleCreateRoutieSpace } =
    useRoutieSpaceNavigation();
  const { openModal } = useModal();
  const { showToast } = useToastContext();
  const { data: user, error, isFetching } = useUserQuery();

  const hasAccessToken = Boolean(getAccessToken());
  const isAuthenticatedUser = user?.role === 'USER';
  const shouldShowUserUI =
    isAuthenticatedUser || (hasAccessToken && isFetching);

  const handleLoginClick = () => {
    openModal('socialLogin');
  };

  const handleCreateRoutieButtonClick = isAuthenticatedUser
    ? handleCreateRoutieSpace
    : handleLoginClick;

  useEffect(() => {
    if (error) {
      showToast({
        message: '사용자 정보를 불러오는 중 에러가 발생했습니다.',
        type: 'error',
      });
      console.error(error);
    }
  }, [error, showToast]);

  return (
    <>
      <Header
        isLoggedIn={shouldShowUserUI}
        onLoginClick={handleLoginClick}
        onLogoClick={handleMoveToHome}
      />
      <div css={HomeScrollContainerStyle}>
        <div css={CircleStyle} />
        <div css={RectangleStyle} />
        <Flex direction="column" padding={10} gap={10} css={HomeContentStyle}>
          <Flex direction="column" gap={20} css={MainContentWrapperStyle}>
            <Flex alignItems="flex-start" gap={20} width="auto">
              <Flex direction="column" alignItems="flex-start" gap={4}>
                <Flex direction="column" gap={10}>
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
                    <Flex
                      justifyContent="flex-start"
                      css={{ marginTop: '5rem' }}
                    >
                      <Text variant="subTitle" color={theme.colors.blue[450]}>
                        루티
                      </Text>
                      <Text variant="subTitle" color={theme.colors.gray[300]}>
                        에서 함께 동선을 만들어보세요!
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <CreateRoutieButton onClick={handleCreateRoutieButtonClick} />
              </Flex>
              <Flex css={{ marginTop: '-6rem' }}>
                <PhoneFrame />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </div>
      <FeedbackWidget />
    </>
  );
};

export default Home;
