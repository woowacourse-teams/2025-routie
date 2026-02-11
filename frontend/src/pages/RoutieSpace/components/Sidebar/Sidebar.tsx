import { Suspense, useState } from 'react';

import ErrorBoundary from '@/@common/components/ErrorBoundary/ErrorBoundary';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import SectionErrorFallback from '@/@common/components/SectionErrorFallback/SectionErrorFallback';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';
import { useRoutieSpaceNavigation } from '@/pages/Home/hooks/useRoutieSpaceNavigation';
import PlaceView from '@/pages/RoutieSpace/components/PlaceView/PlaceView';
import PlaceViewSkeleton from '@/pages/RoutieSpace/components/PlaceView/PlaceViewSkeleton';
import RouteView from '@/pages/RoutieSpace/components/RouteView/RouteView';
import RouteViewSkeleton from '@/pages/RoutieSpace/components/RouteView/RouteViewSkeleton';
import ShareView from '@/pages/RoutieSpace/components/ShareView/ShareView';
import SidebarToggleButton from '@/pages/RoutieSpace/components/SidebarToggleButton/SidebarToggleButton';
import TabButton from '@/pages/RoutieSpace/components/TabButton/TabButton';

import {
  SidebarContainerStyle,
  SidebarContentContainerStyle,
  SidebarTabContainerStyle,
} from './Sidebar.styles';
import { CONTENT_WIDTH, SIDEBAR_WIDTH_CLOSED } from './width';

import type { SidebarProps } from './Sidebar.types';

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<'place' | 'route' | 'share'>(
    'place',
  );
  const { handleMoveToHome } = useRoutieSpaceNavigation();

  const handleTabClick = (tab: 'place' | 'route' | 'share') => {
    if (!isOpen) {
      onToggle();
    }
    setActiveTab(tab);
  };

  return (
    <div css={SidebarContainerStyle(isOpen)}>
      <SidebarToggleButton isOpen={isOpen} onToggle={onToggle} />
      <Flex justifyContent="flex-start" height="100%">
        <Flex
          width={SIDEBAR_WIDTH_CLOSED}
          height="100%"
          css={SidebarTabContainerStyle(isOpen)}
          direction="column"
          justifyContent="flex-start"
          padding="1.4rem 0"
        >
          <Icon
            name="logo"
            size={35}
            css={{ marginBottom: '1.4rem' }}
            onClick={handleMoveToHome}
          />
          <TabButton
            name="장소"
            icon={activeTab === 'place' ? 'placeTabSelect' : 'placeTab'}
            onClick={() => handleTabClick('place')}
            isActive={activeTab === 'place'}
          />
          <TabButton
            name="동선"
            icon={activeTab === 'route' ? 'routeTabSelect' : 'routeTab'}
            onClick={() => handleTabClick('route')}
            isActive={activeTab === 'route'}
          />
          <TabButton
            name="공유"
            icon={activeTab === 'share' ? 'shareTabSelect' : 'share'}
            onClick={() => handleTabClick('share')}
            isActive={activeTab === 'share'}
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
          <ErrorBoundary
            resetKeys={[activeTab]}
            fallbackRender={SectionErrorFallback}
          >
            <Suspense
              fallback={
                activeTab === 'route' ? (
                  <RouteViewSkeleton />
                ) : (
                  <PlaceViewSkeleton />
                )
              }
            >
              {activeTab === 'route' && <RouteView />}
              {activeTab === 'place' && <PlaceView />}
              {activeTab === 'share' && <ShareView />}
            </Suspense>
          </ErrorBoundary>
        </Flex>
      </Flex>
    </div>
  );
};

export default Sidebar;
