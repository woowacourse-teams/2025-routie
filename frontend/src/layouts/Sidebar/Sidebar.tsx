import { useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';
import SideSheet from '@/layouts/SideSheet/SideSheet';
import theme from '@/styles/theme';

import ShareLinkButtonSection from './ShareLinkButtonSection';
import { SidebarContainerStyle } from './Sidebar.styles';
import SidebarWhereSection from './SidebarWhereSection';

const Sidebar = () => {
  const [sheetOpen, setSheetOpen] = useState(true);

  return (
    <div css={SidebarContainerStyle}>
      <Flex
        direction="column"
        justifyContent="flex-start"
        width="50rem"
        height="100%"
        padding="0 1.6rem"
        gap={1.6}
        css={{
          position: 'relative',
          zIndex: 10,
          borderRadius: '0.8rem',
          backgroundColor: `${theme.colors.white}`,
          boxShadow: '0 4px 20px rgb(0 0 0 / 15%)',
          overflow: 'hidden',
        }}
      >
        <RoutieSpaceName />
        <ShareLinkButtonSection />
        <SidebarWhereSection />
      </Flex>
      <SideSheet
        open={sheetOpen}
        onToggle={() => setSheetOpen((prev) => !prev)}
      />
    </div>
  );
};

export default Sidebar;
