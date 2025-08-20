import Flex from '@/@common/components/Flex/Flex';
import Header from '@/@common/components/Header/Header';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';

import { SidebarContainerStyle } from './Sidebar.styles';
import SidebarWhenHowSection from './SidebarWhenHowSection';
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
      <Header isHome={false}>
        <RoutieSpaceName />
      </Header>
      <SidebarWhenHowSection />
      <SidebarWhereSection />
    </Flex>
  );
};

export default Sidebar;
