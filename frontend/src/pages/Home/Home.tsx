import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import GoToLoginButton from '@/domains/auth/components/GoToLoginButton/GoToLoginButton';
import theme from '@/styles/theme';

import {
  ButtonWrapperStyle,
  ContinueButtonStyle,
  CreateButtonStyle,
  HomepageStyle,
  InfoCardsWrapperStyle,
  SubTitleTextStyle,
  TitleTextStyle,
  VioletTextStyle,
} from './Home.styles';
import InfoCard from './components/InfoCard/InfoCard';
import { useRoutieSpaceNavigation } from './hooks/useRoutieSpaceNavigation';

const Home = () => {
  const { handleCreateRoutieSpace, handleReturnToRoutieSpace } =
    useRoutieSpaceNavigation();
  const existingUuid = localStorage.getItem('routieSpaceUuid');

  return (
    <>
      <Header>
        <Button
          width="fit-content"
          onClick={() => alert('사용자 로그인 버튼 클릭됨!')}
        >
          <Text variant="body">로그인</Text>
        </Button>
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
          <Flex gap={5} css={InfoCardsWrapperStyle}>
            <InfoCard
              circleColor={theme.home.pink}
              iconName="collectPlace"
              iconAlt="장소 수집 아이콘"
              title="가고 싶은 곳 모으기"
              textColor={theme.home.text}
              descriptions={[
                '가고 싶은 곳들을 하나씩 모아보세요.',
                '카페, 맛집, 쇼핑몰까지!',
              ]}
            />

            <InfoCard
              circleColor={theme.home.orange}
              iconName="checkHome"
              iconAlt="체크 아이콘"
              title="가능한 동선인지 즉시 확인"
              textColor={theme.home.text}
              descriptions={[
                '소화할 수 있는 동선인지',
                '자동으로 판단해드려요!',
              ]}
            />

            <InfoCard
              circleColor={theme.home.yellow}
              iconName="clockHome"
              iconAlt="시계 아이콘"
              title="이동시간, 거리까지 딱!"
              textColor={theme.home.text}
              descriptions={[
                '각 장소별 이동시간과 거리를',
                '자동으로 계산해요!',
              ]}
            />
          </Flex>
          <Flex gap={8} width="80%" css={ButtonWrapperStyle}>
            <Button onClick={handleCreateRoutieSpace} css={CreateButtonStyle}>
              <Flex gap={1.5} padding={1}>
                <Icon name="arrowWhite" size={30} />
                <Text variant="title" color="white">
                  동선 만들러가기
                </Text>
              </Flex>
            </Button>
            {existingUuid && (
              <Button
                onClick={handleReturnToRoutieSpace}
                css={ContinueButtonStyle}
              >
                <Flex gap={1.5} padding={1}>
                  <Icon name="reload" size={25} />
                  <Text variant="title" color={theme.home.violet}>
                    이어서 만들기
                  </Text>
                </Flex>
              </Button>
            )}
            <GoToLoginButton onClick={() => alert('로그인 버튼 클릭됨!')} />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
