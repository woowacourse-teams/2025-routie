import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';

const Home = () => {
  return (
    <>
      <Header />
      <Flex direction="column" height="70dvh">
        <Button variant="primary">
          <Flex
            direction="column"
            gap={1}
            width="60rem"
            height="20rem"
            padding={1}
          >
            <Text variant="title" color="white">
              루티 스페이스를 생성해
            </Text>
            <Text variant="title" color="white">
              나만의 루티를 만들어보세요 👍
            </Text>
          </Flex>
        </Button>
      </Flex>
    </>
  );
};

export default Home;
