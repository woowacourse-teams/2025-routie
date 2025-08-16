import Flex from '@/@common/components/Flex/Flex';
import useMapView from '@/@common/hooks/useMapView';
import { RoutieProvider } from '@/domains/routie/contexts/useRoutieContext';
import { RoutieValidateProvider } from '@/domains/routie/contexts/useRoutieValidateContext';
import MapWithSideSheet from '@/layouts/MapWithSideSheet/MapWithSideSheet';
import { PlaceListProvider } from '@/layouts/PlaceList/contexts/PlaceListProvider';
import Sidebar from '@/layouts/Sidebar/Sidebar';

const RoutieSpace = () => {
  const { handleViewModeChange } = useMapView();

  return (
    <RoutieValidateProvider>
      <RoutieProvider>
        <PlaceListProvider>
          <Flex justifyContent="flex-start" height="100vh">
            <Flex direction="column" justifyContent="flex-start" height="100%">
              <Sidebar handleViewModeChange={handleViewModeChange} />
            </Flex>
            <Flex direction="column" justifyContent="flex-start" height="100%">
              <MapWithSideSheet />
            </Flex>
          </Flex>
        </PlaceListProvider>
      </RoutieProvider>
    </RoutieValidateProvider>
  );
};

export default RoutieSpace;
