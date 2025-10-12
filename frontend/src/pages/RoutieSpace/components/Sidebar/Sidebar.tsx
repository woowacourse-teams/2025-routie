import { useState } from 'react';

import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import { useToastContext } from '@/@common/contexts/useToastContext';
import RoutieSpaceName from '@/domains/routieSpace/components/RoutieSpaceName/RoutieSpaceName';
import { useShareLink } from '@/domains/routieSpace/hooks/useShareLink';
import PlaceView from '@/pages/RoutieSpace/components/PlaceView/PlaceView';
import RouteView from '@/pages/RoutieSpace/components/RouteView/RouteView';
import TabButton from '@/pages/RoutieSpace/components/TabButton/TabButton';
import theme from '@/styles/theme';

import { SidebarContainerStyle, ToggleButtonStyle } from './Sidebar.styles';
import { SIDEBAR_WIDTH_CLOSED, CONTENT_WIDTH } from './width';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<'place' | 'route'>('place');
  const [isOpen, setIsOpen] = useState(true);

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

  const tabButtonBorder = isOpen
    ? `${theme.radius.sm}  0 0 ${theme.radius.sm}`
    : `${theme.radius.sm}`;

  return (
    <div css={SidebarContainerStyle(isOpen)}>
      <button css={ToggleButtonStyle} onClick={() => setIsOpen(!isOpen)}>
        <Icon
          name="arrowWhite"
          size={20}
          css={{
            transform: `${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </button>
      <Flex justifyContent="flex-start" height="100%">
        <Flex
          width={SIDEBAR_WIDTH_CLOSED}
          height="100%"
          css={{
            backgroundColor: `${theme.colors.white}`,
            borderRadius: `${tabButtonBorder}`,
          }}
          direction="column"
          justifyContent="flex-start"
          padding="1.6rem 0"
        >
          <Icon name="logo" size={34} css={{ marginBottom: '1rem' }} />
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
          css={{
            display: `${isOpen ? 'flex' : 'none'}`,
            borderLeft: `1px solid ${theme.colors.gray[100]}`,
          }}
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
