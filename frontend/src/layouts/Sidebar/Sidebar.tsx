import Flex from '@/@common/components/Flex/Flex';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';

import ShareLinkButtonSection from './ShareLinkButtonSection';
import { SidebarContainerStyle } from './Sidebar.styles';
import SidebarWhereSection from './SidebarWhereSection';

const Sidebar = () => {
  return (
    <Flex
      direction="column"
      justifyContent="flex-start"
      width="50rem"
      height="100dvh"
      gap={1.6}
      css={SidebarContainerStyle}
    >
      <RoutieSpaceName />
      <ShareLinkButtonSection />
      <SidebarWhereSection />
    </Flex>
  );
};

export default Sidebar;
