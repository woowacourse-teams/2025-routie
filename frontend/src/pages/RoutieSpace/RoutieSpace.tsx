import Flex from '@/@common/components/Flex/Flex';
import { RoutieValidateProvider } from '@/domains/routie/contexts/useRoutieValidateContext';
import PlaceList from '@/layouts/PlaceList/PlaceList';
import { PlaceListProvider } from '@/layouts/PlaceList/contexts/PlaceListProvider';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  return (
    <RoutieValidateProvider>
      <PlaceListProvider>
        <Flex justifyContent="flex-start" height="100vh">
          <Flex direction="column" justifyContent="flex-start" height="100%">
            <Sidebar />
          </Flex>
          <Flex direction="column" justifyContent="flex-start" height="100%">
            <PlaceList />
          </Flex>
        </Flex>
      </PlaceListProvider>
    </RoutieValidateProvider>
  );
};

export default RoutieSpace;
