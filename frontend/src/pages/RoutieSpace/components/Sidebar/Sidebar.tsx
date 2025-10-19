import { useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import { useToastContext } from '@/@common/contexts/useToastContext';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';
import { useShareLink } from '@/domains/routieSpace/hooks/useShareLink';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';
import PlaceView from '@/pages/RoutieSpace/components/PlaceView/PlaceView';
import RouteView from '@/pages/RoutieSpace/components/RouteView/RouteView';
import SidebarToggleButton from '@/pages/RoutieSpace/components/SidebarToggleButton/SidebarToggleButton';
import TabButton from '@/pages/RoutieSpace/components/TabButton/TabButton';

import {
  SidebarContainerStyle,
  SidebarContentContainerStyle,
  SidebarTabContainerStyle,
} from './Sidebar.styles';
import { CONTENT_WIDTH, SIDEBAR_WIDTH_CLOSED } from './width';

import type { SidebarProps } from './Sidebar.types';

const Sidebar = ({ isOpen, handleToggle }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<'place' | 'route'>('place');
  const { handleMoveToHome } = useRoutieSpaceNavigation();
  const { showToast } = useToastContext();
  const shareLink = useShareLink();

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      showToast({ type: 'info', message: '링크가 복사되었습니다.' });
    } catch (error) {
      showToast({ type: 'error', message: '링크 복사를 실패하였습니다.' });
    }
  };

  return (
    <div css={SidebarContainerStyle(isOpen)}>
      <SidebarToggleButton isOpen={isOpen} handleToggle={handleToggle} />
      <Flex justifyContent="flex-start" height="100%">
        <Flex
          width={SIDEBAR_WIDTH_CLOSED}
          height="100%"
          css={SidebarTabContainerStyle(isOpen)}
          direction="column"
          justifyContent="flex-start"
          padding="1.6rem 0"
        >
          <Icon
            name="logo"
            size={34}
            css={{ marginBottom: '1rem' }}
            onClick={handleMoveToHome}
          />
          <TabButton
            name="장소"
            icon={activeTab === 'place' ? 'placeTabSelect' : 'placeTab'}
            onClick={() => setActiveTab('place')}
            isActive={activeTab === 'place'}
          />
          <TabButton
            name="동선"
            icon={activeTab === 'route' ? 'routeTabSelect' : 'routeTab'}
            onClick={() => setActiveTab('route')}
            isActive={activeTab === 'route'}
          />
          <TabButton
            name="링크 공유"
            icon="share"
            onClick={handleCopy}
            isActive={false}
          />
        </Flex>
        <Flex
          direction="column"
          width={CONTENT_WIDTH}
          gap={1}
          justifyContent="flex-start"
          height="100%"
          padding="1.6rem 0"
          css={SidebarContentContainerStyle(isOpen)}
        >
          <RoutieSpaceName />
          {activeTab === 'route' && <RouteView />}
          {activeTab === 'place' && <PlaceView />}
        </Flex>
      </Flex>
    </div>
  );
};

export default Sidebar;
