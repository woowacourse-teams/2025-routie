import { useNavigate } from 'react-router';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import Text from '@/@common/components/Text/Text';
import { createRoutieSpace } from '@/domains/routieSpace/apis/createRoutieSpace';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateRoutieSpace = async () => {
    try {
      await createRoutieSpace();

      const uuid = localStorage.getItem('routieSpaceUuid');

      if (!uuid) return;

      navigate(`/routie-spaces?routieSpaceIdentifier=${uuid}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <Flex direction="column" height="70dvh">
        <Button
          variant="primary"
          onClick={handleCreateRoutieSpace}
          width="fit-content"
        >
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
              나만의 루티를 만들어보세용ㅋ 👍
            </Text>
          </Flex>
        </Button>
      </Flex>
    </>
  );
};

export default Home;
