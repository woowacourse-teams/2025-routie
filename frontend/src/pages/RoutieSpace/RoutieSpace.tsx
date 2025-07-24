import Flex from '@/@common/components/Flex/Flex';
import PlaceList from '@/layouts/PlaceList/PlaceList';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  return (
    <>
      <Flex justifyContent="flex-start" height="100vh">
        <Flex direction="column" justifyContent="flex-start" height="100%">
          <Sidebar />
        </Flex>
        <Flex direction="column" justifyContent="flex-start" height="100%">
          <PlaceList />
        </Flex>
      </Flex>
    </>
  );
};

export default RoutieSpace;
