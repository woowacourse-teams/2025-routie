import { useEffect, useState } from 'react';

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
  const [activeTab, setActiveTab] = useState<'place' | 'route' | null>('place');
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

  const handleTabClick = (tab: 'place' | 'route') => {
    if (!isOpen) {
      handleToggle();
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!isOpen) {
      setActiveTab(null);
    }
  }, [isOpen]);

  return (
    <div css={SidebarContainerStyle(isOpen)} tabIndex={-1}>
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
          <p id="sideBar" className="hide" tabIndex={0}>
            사이드바에서 장소, 동선, 링크 공유 중 하나를 선택할 수 있습니다. 각
            탭에 포커스를 이동한 뒤 엔터를 누르면 해당 기능이 열립니다.
          </p>
          <TabButton
            name="장소"
            icon={activeTab === 'place' ? 'placeTabSelect' : 'placeTab'}
            onClick={() => handleTabClick('place')}
            isActive={activeTab === 'place'}
            aria-label="장소 탭"
          />
          <TabButton
            name="동선"
            icon={activeTab === 'route' ? 'routeTabSelect' : 'routeTab'}
            onClick={() => handleTabClick('route')}
            isActive={activeTab === 'route'}
            aria-label="동선 탭"
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
